// 启动TW
console.log(chalk.grey.bold("Loading TW core"));
if (!$tw) {
  $tw = require("tiddlywiki/boot/boot").TiddlyWiki();
  $tw.boot.argv = ["."];
  $tw.boot.boot();
}

// 遍历、下载所有发行版
const editionsInfo = [];
const editionCallbackInfo = {
  title: "$:/temp/tw-cpl/edition-callback-info",
  text: {},
  type: "application/json",
};
const editionInfoTiddlerTitles = $tw.wiki.filterTiddlers(
  "[all[tiddlers]!is[draft]tag[$:/tags/EditionWiki]]"
);
// 已下载的文件记录在这里面，防止重复下载
const downloadFileMap = {};
mkdirsSync(`${distDir}/editions`); // 发行版目标目录
mkdirsSync(`${distDir}/tmp`); // 临时的发行版目录
shellI(`cp edition_files/* ${distDir}/tmp/`); // 拷贝本地发行版(未在网络上发布的)
editionInfoTiddlerTitles.forEach((title) => {
  try {
    const tiddler = $tw.wiki.getTiddler(title).fields;
    // 带有uri，需要下载下来，但是需要是tw支持的格式
    if (
      tiddler["ate.uri"] &&
      tiddler["ate.uri"] !== "" &&
      $tw.config.fileExtensionInfo[path.extname(tiddler["ate.uri"])] &&
      tiddler["ate.title"] &&
      tiddler["ate.title"] !== ""
    ) {
      console.log(
        `- Downloading edition file ${chalk.bold(tiddler["ate.title"])}`
      );
      const distEditionName =
        formatTitle(tiddler["ate.title"]) + path.extname(tiddler["ate.uri"]);
      if (downloadFileMap[tiddler["ate.uri"]]) {
        shellI(
          `cp ${
            downloadFileMap[tiddler["ate.uri"]]
          } ${distDir}/tmp/${distEditionName}`
        );
      } else {
        shellI(
          `wget '${tiddler["ate.uri"]}' -O ${distDir}/tmp/${distEditionName}`
        );
        downloadFileMap[
          tiddler["ate.uri"]
        ] = `${distDir}/tmp/${distEditionName}`;
      }
    }
  } catch (e) {
    console.error(chalk.red.bold(e));
  }
});