# Normal public-source startup / 公开源码正常启动

Read the public motion.lock.json and dependencies/runtime-dependencies.json. The bootstrap uses only the host Python standard library, so doctor and capabilities work before NumPy/jsonschema/OpenCV are installed. The locked production interpreter is Python3.13. Prefer an existing Python3.13 or an existing uv-managed3.13. The default system Python3.14 is not treated as compatible with these wheels. If no compatible interpreter exists, doctor names that concrete prerequisite. Setup never changes global Python.

本公开包直接使用解压根目录 kinetic_bootstrap.py。doctor/capabilities 不依赖第三方Python库；制作使用独立Python3.13环境，不在系统Python里安装依赖，系统3.14不会被冒充为兼容。官网个人包另按其随包助手执行。

Normal commands (the assistant fills real absolute paths; the user need not type them):

    python3 -B kinetic_bootstrap.py doctor
    python3 -B kinetic_bootstrap.py setup
    python3 -B kinetic_bootstrap.py capabilities
    python3 -B kinetic_bootstrap.py check-params --input <user.json>
    python3 -B kinetic_bootstrap.py plan --input <user.json> --out <work>/plan.json
    python3 -B kinetic_bootstrap.py prepare --input <user.json> --out <work>/project
    python3 -B kinetic_bootstrap.py preview --instance <work>/project --time 2 --out <work>/preview.png
    python3 -B kinetic_bootstrap.py render --instance <work>/project --out <work>/silent.mp4

The final sound result is silent-with-audio.mp4. All outputs need fresh paths. For an explicitly chosen external dependency-cache root, put --cache <cache-root> before the operation and keep using that root. The default is the platform's external MotionGit cache. Setup stores only the exact hashed Python wheels, locked Node dependencies and receipts there. It does not persist the helper's temporary template core. Rendering reuses that same isolated Python and explicitly loads playwright-core from this cache. Existing compatible Chrome/Chromium is used; explicit setup may install the standard Playwright headless shell into Playwright's own default browser cache if absent. FFmpeg/ffprobe and Node/npm remain declared host tools.

setup 会安装并核对完整锁定的Python与Node依赖，后续每一步使用同一Python，并从已核对外部缓存加载Node模块。依赖缓存与浏览器默认缓存可以保留复用；模板临时核心不作为安装目录。依赖失败须保留准确诊断；不要当作文稿太长、ASR不准或同步失败，也不能虚构 setup 成功。

This public source edition uses python3 -B kinetic_bootstrap.py doctor/setup/... directly. Official personal packages separately use their verified bundled helper. Read AUDIO.md, NARRATION-MAP.md and DURATION.md for actual audio, phrase ownership and full-narration planning. Initial environment readiness, final encoded audio, actual action meaning and listening are separate checks.
