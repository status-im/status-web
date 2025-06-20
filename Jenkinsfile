#!/usr/bin/env groovy
library 'status-jenkins-lib@v1.9.24'

def changesDetected = false

pipeline {
  agent { label 'linux' }

  options {
    timestamps()
    /* Prevent Jenkins jobs from running forever */
    timeout(time: 10, unit: 'MINUTES')
    /* manage how many builds we keep */
    buildDiscarder(logRotator(
      numToKeepStr: '20',
      daysToKeepStr: '30',
    ))
    disableConcurrentBuilds()
  }

  parameters {
    choice(
      name: 'APP_NAME',
      description: 'Name of app from apps folder.',
      choices: choiceFromJobName(params.APP_NAME, ['connector', 'wallet']),
    )
    booleanParam(
      name: 'FORCE_BUILD',
      description: 'Build even if no changes detected.',
      defaultValue: params.FORCE_BUILD ?: false
    )
  }

  environment {
    PLATFORM = "${params.APP_NAME}"
    ZIP_NAME = utils.pkgFilename(
      name: 'StatusWeb',
      type: params.APP_NAME,
      version: 'none',
      arch: 'chrome',
      ext: 'zip',
    )
  }

  stages {
    stage('Check Changed Files') {
      when {
        changeset(
          pattern: "apps/${params.APP_NAME}/**",
          comparator: "GLOB"
        )
      }
      steps {
        script {
          changesDetected = true
        }
      }
    }

    stage('Install') {
      when { expression { changesDetected || params.FORCE_BUILD } }
      steps {
        dir("${env.WORKSPACE}/apps/${params.APP_NAME}") {
          script {
            nix.shell(
              'pnpm install --frozen-lockfile',
              pure: false,
              entryPoint: "${env.WORKSPACE}/apps/${params.APP_NAME}/shell.nix"
            )
          }
        }
      }
    }

    stage('Build') {
      when { expression { changesDetected || params.FORCE_BUILD } }
      steps {
        dir("${env.WORKSPACE}") {
          script {
            nix.shell(
              "pnpm turbo run build --filter=${params.APP_NAME}",
              pure: false,
              entryPoint: "${env.WORKSPACE}/apps/${params.APP_NAME}/shell.nix"
            )
          }
        }
      }
    }

    stage('Zip') {
      when { expression { changesDetected || params.FORCE_BUILD } }
      steps {
        dir("${env.WORKSPACE}/apps/${params.APP_NAME}") {
          zip(
            zipFile: env.ZIP_NAME,
            dir: getBuildDir(params.APP_NAME),
            archive: false,
          )
        }
      }
    }

    stage('Archive') {
      when { expression { changesDetected || params.FORCE_BUILD } }
      steps {
        dir("${env.WORKSPACE}/apps/${params.APP_NAME}") {
          archiveArtifacts(
            artifacts: env.ZIP_NAME,
            fingerprint: true,
          )
        }
      }
    }

    stage('Upload') {
      when { expression { changesDetected || params.FORCE_BUILD } }
      steps {
        dir("${env.WORKSPACE}/apps/${params.APP_NAME}") {
          script {
            env.PKG_URL = s5cmd.upload(env.ZIP_NAME)
            jenkins.setBuildDesc(ZIP: env.PKG_URL)
          }
        }
      }
    }
  }

  post {
    success { script { if (changesDetected && CHANGE_ID) { github.notifyPR(true) } } }
    failure { script { if (changesDetected && CHANGE_ID) { github.notifyPR(false) } } }
    cleanup { cleanWs() }
  }
}

List<String> moveToStart(List<String> original, String input) {
  original.split {it.equals(input)}.flatten()
}

/* If job name contains one of choices make that the default(first). */
def choiceFromJobName(String previousChoice, List defaultChoices) {
  if (previousChoice != null) {
    return moveToStart(defaultChoices, previousChoice)
  }
  def tokens = env.JOB_NAME.split('/')
  for (choice in defaultChoices) {
    if (tokens.contains(choice)) {
      return moveToStart(defaultChoices, choice)
    }
  }
  return defaultChoices
}

def getBuildDir(String appName) {
  switch(appName) {
    case 'connector':
      return 'build/chrome-mv3-prod'
    case 'wallet':
      return '.output/chrome-mv3'
    default:
      error("Unknown app: ${appName}.")
  }
}
