# **梦幻学习计时器**

一款专为移动端设计的唯美、梦幻风格的学习与工作辅助计时器，利用科学的时间管理方法（长专注周期 \+ 短暂小憩）和个性化设置，帮助用户提高效率、保持专注并缓解疲劳。本项目使用 Capacitor 将 Web 应用封装为安卓 App。

## **✨ 功能特性**

* **科学计时周期:** 默认 90 分钟专注 \+ 20 分钟休息循环。  
* **定时小憩提醒:** 专注期间每隔 8-10 分钟（可调）进行 10 秒（可调）小憩，缓解疲劳。  
* **暂停记录:** 记录专注时段内的暂停次数与时间点。  
* **可视化界面:** 清晰的主计时器、小憩倒计时以及小憩/暂停日志。  
* **高度个性化:**  
  * **时间自定义:** 可自由调整专注、休息、小憩的时长与小憩间隔。  
  * **背景更换:** 支持设置图片或视频作为背景（通过 URL 或本地上传）。  
  * **外观调整:** 可调节计时器框的透明度。  
  * **提示音定制:** 可选择内置音效或上传自定义提示音。  
  * **背景音乐播放器:** 内置简单的音乐播放器，可上传本地音乐列表进行播放，支持顺序、循环、随机模式。  
* **移动端优化:** 界面和交互针对手机屏幕进行了优化。  
* **后台计时优化:** 使用 Web Worker 提高计时器在应用进入后台时的准确性。

## **🛠️ 技术栈**

* **前端:** HTML, CSS (Tailwind CSS), JavaScript  
* **音频:** Tone.js  
* **打包框架:** Capacitor  
* **图标/字体:** Font Awesome

## **🚀 开始使用**

**1\. 先决条件:**

在开始之前，请确保你的开发环境已安装并配置好：

* [Node.js](https://nodejs.org/) (LTS 版本) 和 npm  
* [Java Development Kit (JDK)](https://adoptium.net/) (OpenJDK 11 或更高版本)  
* [Android Studio](https://developer.android.com/studio) (包含 Android SDK)  
* 配置好 JAVA\_HOME 和 Android SDK 相关的环境变量 (ANDROID\_SDK\_ROOT 或 ANDROID\_HOME, 并将 platform-tools 和 cmdline-tools/tools 加入 PATH)。

**2\. 克隆仓库:**

git clone https://github.com/joinsnow-star/mobile-timer-capacitor.git  
cd mobile-timer-capacitor

**3\. 安装依赖:**

npm install

**4\. 添加/同步 Android 平台:**

如果你是首次设置，或者需要重新生成 android 目录：

npx cap add android

如果你修改了 www 目录下的网页代码，运行：

npx cap sync android

**5\. 在 Android Studio 中打开:**

npx cap open android

或者手动在 Android Studio 中打开项目下的 android 文件夹。

**6\. 构建和运行:**

* 在 Android Studio 中等待 Gradle 同步完成（如果遇到网络问题，请参考项目设置指南配置本地 Gradle）。  
* 选择一个模拟器或连接你的安卓设备（确保已开启 USB 调试）。  
* 点击 Android Studio 工具栏中的 "Run 'app'" 按钮（绿色三角形）。  
* 或者，构建调试 APK：选择菜单 **Build** \-\> **Build Bundle(s) / APK(s)** \-\> **Build APK(s)**。生成的 app-debug.apk 文件位于 android/app/build/outputs/apk/debug/ 目录下，可以手动安装到设备上。

## **🎨 定制**

应用的大部分功能和外观可以通过应用内的“设置”面板进行调整，无需修改代码。

* **时间设置:** 调整专注、休息、小憩时长和间隔。  
* **背景与外观:** 更换图片/视频背景，调整计时框透明度。  
* **提示音:** 选择或上传提示音。  
* **背景音乐:** 上传和管理背景音乐播放列表。

## **📄 许可证**

本项目采用 MIT 许可证。详情请见 [LICENSE](http://docs.google.com/LICENSE) 文件 

## **🚀 下载**
获取链接：https://wwbf.lanzouk.com/b00zxq7i6h 密码:bdi9
