#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.9.39'

def changesDetected = false

pipeline {
  agent {
    docker {
      label 'linuxcontainer'
      image 'harbor.status.im/infra/ci-build-containers:linux-base-1.0.0'
      args '--volume=/var/run/docker.sock:/var/run/docker.sock ' +
           '--user jenkins'
    }
  }

  options {
    timestamps()
    timeout(time: 40, unit: 'MINUTES')
    buildDiscarder(logRotator(
      numToKeepStr: '20',
      daysToKeepStr: '30',
    ))
    disableConcurrentBuilds()
  }

  parameters {
    string(
      name: 'DOCKER_CRED',
      description: 'Name of Docker Registry credential.',
      defaultValue: params.DOCKER_CRED ?: 'harbor-status-web-robot',
    )
    string(
      name: 'DOCKER_REGISTRY_URL',
      description: 'URL of the Docker Registry.',
      defaultValue: params.DOCKER_REGISTRY_URL ?: 'https://harbor.status.im',
    )
    string(
      name: 'IMAGE_NAME',
      description: 'Name of the Docker image.',
      defaultValue: 'status-web/status-app',
    )
  }

  environment {
    DOCKER_BUILDKIT = '1'
    NEXT_PUBLIC_GHOST_API_URL  = 'https://our.status.im'
    NEXT_PUBLIC_HASURA_API_URL = 'https://hasura.bi.status.im/v1/graphql'
    GREENHOUSE_STATUS_BOARD_ID = 'status72'
    GREENHOUSE_LOGOS_BOARD_ID  = 'logos'
  }

  stages {
    stage('Build image') {
      steps {
        script {
          env.SHORT_SHA = env.GIT_COMMIT.take(8)  // persists to Push image
          withCredentials([
            string(credentialsId: 'status-web-infura-api-key',     variable: 'INFURA_API_KEY'),
            string(credentialsId: 'status-web-greenhouse-api-key', variable: 'GREENHOUSE_API_KEY'),
            string(credentialsId: 'status-web-github-token',       variable: 'GITHUB_TOKEN'),
            string(credentialsId: 'status-web-ghost-api-key',      variable: 'NEXT_PUBLIC_GHOST_API_KEY'),
          ]) {
            image = docker.build(
              "${params.IMAGE_NAME}:${env.SHORT_SHA}",
              "--secret id=infura_api_key,env=INFURA_API_KEY " +
              "--secret id=greenhouse_api_key,env=GREENHOUSE_API_KEY " +
              "--secret id=github_token,env=GITHUB_TOKEN " +
              "--build-arg NEXT_PUBLIC_GHOST_API_URL='${env.NEXT_PUBLIC_GHOST_API_URL}' " +
              "--build-arg NEXT_PUBLIC_GHOST_API_KEY='${NEXT_PUBLIC_GHOST_API_KEY}' " +
              "--build-arg NEXT_PUBLIC_INFURA_API_KEY='${INFURA_API_KEY}' " +
              "--build-arg NEXT_PUBLIC_HASURA_API_URL='${env.NEXT_PUBLIC_HASURA_API_URL}' " +
              "--build-arg GREENHOUSE_STATUS_BOARD_ID='${env.GREENHOUSE_STATUS_BOARD_ID}' " +
              "--build-arg GREENHOUSE_LOGOS_BOARD_ID='${env.GREENHOUSE_LOGOS_BOARD_ID}' " +
              "-f ./apps/status.app/Dockerfile ."
            )
          }
        }
      }
    }

    stage('Push image') {
      steps {
        script {
          String deployTag = isMasterBranch() ? 'deploy-master' : 'deploy-develop'
          withDockerRegistry([
            credentialsId: params.DOCKER_CRED, url: params.DOCKER_REGISTRY_URL
          ]) {
            image.push()
            image.push(deployTag)
          }
          jenkins.setBuildDesc(
            IMAGE: "${params.IMAGE_NAME}:${env.SHORT_SHA}",
            TAG:   deployTag,
          )
        }
      }
    }
  }

  post {
    cleanup { cleanWs() }
  }
}

def isMasterBranch() { GIT_BRANCH ==~ /.*master/ }
