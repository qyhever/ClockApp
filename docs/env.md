
### Android SDK 环境错误 (需手动配置)
您遇到的 `Error: spawn adb ENOENT` 和 `Failed to resolve the Android SDK path` 错误表明您的开发环境缺少 Android SDK 或者没有正确配置环境变量。

**原因**：
*   您的电脑上可能未安装 Android Studio 或 Android SDK。
*   或者安装了 SDK，但没有设置 `ANDROID_HOME` 环境变量，导致 Expo 找不到它。

**解决方案**：

#### 方案 A：使用 Expo Go (推荐，最简单)
如果您不想配置繁琐的 Android 开发环境，您可以直接在真机上运行：
1.  在您的 Android 手机上安装 **Expo Go** 应用 (Google Play Store 或官网下载)。
2.  确保手机和电脑连接同一个 Wi-Fi。
3.  在终端运行 `npm start` (不要加 `--android`)。
4.  使用 Expo Go 扫描终端中显示的二维码即可预览。

#### 方案 B：配置本地 Android 环境 (高级)
如果您确实需要在电脑上的 Android 模拟器中运行，您需要：
1.  下载并安装 **Android Studio**。
2.  在 Android Studio 中安装 **Android SDK** 和 **Command-line Tools**。
3.  配置环境变量 (在 `.zshrc` 或 `.bash_profile` 中添加)：
    ```bash
    export ANDROID_HOME=$HOME/Library/Android/sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/platform-tools
    ```
4.  运行 `source ~/.zshrc` 使配置生效。

**建议**：先尝试方案 A (Expo Go)，这是 Expo 开发最便捷的方式。如果您之后需要打包发布，再配置本地环境或使用 EAS Build 云端构建。