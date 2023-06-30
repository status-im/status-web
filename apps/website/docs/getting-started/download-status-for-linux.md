---
id: 32
title: Download Status for Linux
---

The Status desktop app is the best way to use Status on Linux. Take a look at the steps below to get started.

## Step 1: Download the Linux app

1. Visit [status.im/get :octicons-tab-external-16:](https://status.im/get)
1. Under the **Desktop** section, click the **Linux** button.
1. Locate the file in your Downloads folder (the download file name begins with StatusIm-Desktop).
1. Open Terminal and change the directory to your Downloads folder. Example:

   ```shell
   cd ~/Downloads
   ```

1. Run the following command in your terminal to extract the tarball file:

   ```shell
   tar xvf StatusIm-Desktop-*.tar.gz
   ```

:::info
Replace the \* with the Status app version number. For example: `StatusIm-Desktop-v1.2.tar.gz`
:::

1. Optionally, [verify the Status app GPG signature](#verify-the-status-app-gpg-signature).
1. To launch Status, go to the directory where you have the Status app and double click the AppImage file.

## Step 2: Run the Status app for the first time

If this is the first time you run Status on your computer, check [Run the Status app for the first time](./run-the-status-app-for-the-first-time.md).

## Verify the Status app GPG signature

When you verify the GPG signature of the Status app, you confirm that the app has not been altered. To verify the GPG signature on Linux, you use Status app public key and the [GNU Privacy Guard (or GPG) :octicons-tab-external-16:](https://gnupg.org/) software that comes with most Linux distributions.

1. Open Terminal and change to the directory with the Status AppImage file.
1. Download and import the Status release public key:

   ```sh
   curl -s 'https:///status.im/gpg/release.asc' | gpg --import

   ```

1. Update the GPG trust database to include the Status' public key:

   ```sh
   echo '1DD92FFA442D4B5C85C039231A151FD0883555FE:6:' | gpg --import-ownertrust

   ```

1. Validate the Status app GPG signature. For example, if you downloaded the Status app version 1.2, run this command:

   ```shell
   gpg --verify 'StatusIm-Desktop-v1.2.AppImage.asc'
   ```

1. The GPG signature verification is sucessful when you can see the `Good signature` message. Example:

   ```shell
   gpg: Good signature from "Status.im Release Signing (GPG key for signing Status.im release builds.) <admin@status.im>" [ultimate]
   ```
