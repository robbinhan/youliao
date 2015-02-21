注意: 内置的 iOS SDK 在发布应用时应该替换
src/ios/libWeChatSDK.a 这个文件有两个版本, 一个是 iPhone Only 的, 要小一些, 应该是最后生产环境用的. 我放进去的是完整版本, 要大一倍 (应该是包含了 x86 架构方便模拟器 debug), 可以自己去下载官方 SDK 然后替换掉 platforms/ios/应用名称/Plugins 目录下的 libWeChatSDK.a.
