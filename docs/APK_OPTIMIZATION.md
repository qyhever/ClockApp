# APK 体积优化指南

## 已实施的优化措施

### 1. 启用 R8/ProGuard 代码混淆和优化
**文件**: `android/gradle.properties`
```
android.enableMinifyInReleaseBuilds=true
```
- **效果**: 移除未使用的代码，重命名类和方法为较短的名称
- **预期节省**: 15-20% 的 Java 代码大小

### 2. 启用资源收缩
**文件**: `android/gradle.properties`
```
android.enableShrinkResourcesInReleaseBuilds=true
```
- **效果**: 自动分析代码中的资源使用情况，移除未被引用的资源（图片、字符串等）
- **预期节省**: 5-10%

### 3. 启用 JavaScript Bundle 压缩
**文件**: `android/app/build.gradle` 中的 React 配置
```
enableBundleCompression = true
```
- **效果**: 使用 gzip 或类似的压缩算法压缩 JavaScript bundle
- **预期节省**: 30-40% 的 JS bundle 大小

### 4. Hermes JS 引擎（已启用）
**文件**: `android/gradle.properties`
```
hermesEnabled=true
```
- **效果**: 使用 Facebook 开发的轻量级 JS 引擎，而不是 JSC
- **预期节省**: 10-20%（bundle 体积更小，启动时间更快）

### 5. 禁用不必要的图片格式支持
**文件**: `android/gradle.properties`
```
expo.gif.enabled=false
expo.webp.animated=false
```
- **效果**: 移除 GIF 和动画 WebP 支持库
- **预期节省**: ~2-5 MB

### 6. 优化 ProGuard 规则
**文件**: `android/app/proguard-rules.pro`
- 添加了更激进的优化选项（-optimizationpasses）
- 保留必要的 React Native 和原生方法

## 使用方式

### 构建 Release APK
```bash
npm run build:android
# 或
cd android && ./gradlew assembleRelease
```

### 查看构建分析
构建完成后，检查 `android/app/build/outputs/bundle/release/` 中的构建报告。

## 进阶优化（可选）

### 1. 删除不需要的架构
如果你只在真实 ARM64 设备上运行，可以注释掉 `android/gradle.properties` 中的架构限制：

```properties
# 只保留 arm64-v8a 架构
reactNativeArchitectures=arm64-v8a
```
这可以额外节省 **10-15 MB 左右**。

### 2. 优化 Gradle 构建选项
在 `android/build.gradle` 中可以添加：
```gradle
android {
    packagingOptions {
        exclude 'META-INF/DEPENDENCIES'
        exclude 'META-INF/LICENSE'
        exclude 'META-INF/LICENSE.txt'
        exclude 'META-INF/NOTICE'
    }
}
```

### 3. 检查和删除不用的依赖
审查 `package.json` 中的依赖项，移除未使用的库。

### 4. 使用 AAB (Android App Bundle) 而不是 APK
AAB 格式允许 Google Play Store 为每个设备生成优化的 APK，进一步减少用户下载大小。

## 预期效果总结

| 优化措施 | 预期节省 |
|--------|-------|
| R8/ProGuard Minify | 15-20% |
| 资源收缩 | 5-10% |
| JS Bundle 压缩 | 30-40% |
| Hermes 引擎 | 10-20% |
| 禁用图片格式 | 2-5 MB |
| **总计** | **约 30-50%** |

根据当前 50MB 的大小，这些优化可以帮助你将 APK 体积减少到 **25-35 MB** 左右（具体取决于你的应用内容）。

## 测试和验证

1. 构建 APK 后，使用以下命令检查大小：
```bash
ls -lh android/app/build/outputs/apk/release/
```

2. 使用 Android Studio 的 "Analyze APK" 功能深入分析 APK 结构

3. 在真实设备上进行功能测试，确保优化不会影响应用功能

## 问题排查

如果构建失败，常见原因：
- **class not found**: ProGuard 配置过于激进，需要在 proguard-rules.pro 中添加 `-keep` 规则
- **build fails**: 清理构建缓存：`cd android && ./gradlew clean`
