

<!-- motiongit.caption-publish-safe/1 -->
## 竖屏发布预留 / Portrait publish preview

新竖屏默认采用短视频发布预留：字幕底距为画高的24%，左距8%，右距16%。
这是一套可调的制作预设，不是抖音或任意设备/界面的官方保证。展开的发布文案、
评论、无障碍字号和按钮布局可能占据更多位置；按本期真实发布界面检查并调整。

助手先确认字幕来源：模板字幕看正常字幕轨和DOM边框；照片/视频里烧录的字只能
结合原素材关键帧检查。素材字不受模板字幕参数控制，不能把模板检查通过当成它也通过。
使用现有素材适配步骤，将完整关键可见区域放入合适的画面窗口，必要时用contain/留边
或重新安排该素材窗口；不要自动裁丢人物、商品、重要文字或遮盖主体。无法同时保留时
说明具体冲突，再按用户已有目标选择干净原片或重排，不能私自擦除/伪造原素材。

组件可选 timeline.captionPosition={bottomRatio,leftRatio,rightRatio}；原生沿用
brief.subtitlePosition（深色控制台原生为可选顶层captionPosition）；科技风为captionPosition。
这些是助手可用的现有/可选适配参数，不向用户索要技术表格。组件/科技风显式
captionSafeArea="frame"可复核旧位置；旧包/工程保留，不改原文件。横屏默认不变。

字幕区与标题、人物、照片、视频、按钮要分别安排。正常导出按实际可见矩形拒绝
字幕越出预留区或盖住重要图文；报告中的对象和坐标用于重排那一个区域，不是把全片
统一上移或缩小。长句保持完整含义和真实整句/逐词时钟，按合法词界换行；超出可读
行数时使用真实已核对的短语边界或改排版，不估计词时间、不删限定词、不压成小字。

审核最终编码的长短句、整句/逐词、人物/照片/视频场景，并叠加标明“模拟”的底部文案
和右侧按钮遮挡。DOM检查不识别素材像素中的字幕，也不代表所有平台界面均安全。


<!-- motiongit.caption-visible-inset/1 -->
### Visible subject windows / 主体实际可见窗口

Normal caption overlap checks intersect the subject/text with supported ancestor
overflow and rectangular CSS inset() clips, including positive axis-aligned 2D
scale/translation. Unsupported shapes, rotation/skew/perspective or unresolved
units retain conservative original bounds; a clip-path label never exempts a
subject. A visible strip of a large subject still obstructs a caption. Complete
caption bounds, reading-area checks and actual overlaps remain checked.

中文：正常预览/导出按可准确换算的矩形裁切核对真正可见主体与文字。未知或旋转
裁切仍保守检查，不按场景/图片豁免。此修复不移动或裁剪主体、不改字幕位置、
完整文本、原声/词时钟和原生组容量；官方示例保持原输入。DOM通过仍不代表
素材内烧录字、所有发布界面或艺术/语义已验收，仍需看实际完整编码成片。
