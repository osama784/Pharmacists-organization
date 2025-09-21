export default function getChromePath() {
    const platform = process.platform;

    if (platform === "win32") {
        // Common Windows paths for Chrome
        return (
            [
                "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
                "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
            ].find((path) => require("fs").existsSync(path)) || undefined
        );
    } else if (platform === "darwin") {
        // macOS path
        return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
        // Linux path
        return "/usr/bin/google-chrome";
    }
}
