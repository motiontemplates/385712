# 媒体路径兼容修复候选 / Portable media paths candidate

本候选另存于线上 0.2.10-open-beta（release 313）之后，尚未上传。
写入浏览器配置的媒体 file/directory 一律使用正斜杠相对路径；运行时兼容读取旧 Windows 反斜杠绑定。人物视频、静态图片、其他视频序列与配音/配乐共用此约定。本机媒体输入和外部工具参数仍使用宿主原生路径。
本候选保留线上基于 integrity.json 键的内容身份算法，不把机器绝对路径混入源文件身份。原构建脚本的枚举键和清单也改为 POSIX 路径，防止以后重新构建时退回系统分隔符。
不改变视觉、时间角标／动态装饰标志、完整口播规则或已支持画幅。
Windows 路径语义回归和 macOS 正常 prepare→preview 的实际记录在包外同版审核页；该历史候选阶段尚无真实 Windows 系统执行验收；当前 0.2.31 的固定粗略居中 Windows 11 正常入口已实测，范围见 PUBLIC-SOURCE.md。

This unpublished candidate keeps release 313 as its source. Prepared media bindings use POSIX relative URLs; readers also normalize legacy Windows backslashes for presenter, still/video media and audio. Host input paths remain native. The existing integrity-key content identity algorithm is retained. Visual design, corner decoration, full narration and supported layouts are unchanged. See the adjacent evidence for actual macOS preparation/previews and Windows path-semantics regression; native Windows execution of that historical candidate was untested. The current 0.2.31 fixed-centering Windows 11 normal-entry scope is documented in PUBLIC-SOURCE.md.
