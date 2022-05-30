(function() {
    "use strict";
    var Widget = require("$:/core/modules/widgets/widget.js").widget;
    var GiscusNodeWidget = function(parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };
    GiscusNodeWidget.prototype = new Widget();
    GiscusNodeWidget.prototype.render = function(parent, nextSibling) {
        this.parentDomNode = parent;
        this.computeAttributes();
        this.execute();
        var id = this.getAttribute("id", "");
        var lang = this.getAttribute("lang", "en");
        var theme = this.getAttribute("theme", "light");
        if (id === '') return;
        var scriptNode = this.document.createElement('script');
        scriptNode.setAttribute("src", "https://giscus.app/client.js");
        scriptNode.setAttribute("data-repo", "tiddly-gittly/TiddlyWiki-CPL");
        scriptNode.setAttribute("data-repo-id", "R_kgDOGZOJxQ");
        scriptNode.setAttribute("data-category", "Plugins");
        scriptNode.setAttribute("data-category-id", "DIC_kwDOGZOJxc4CASwR");
        scriptNode.setAttribute("data-mapping", "specific");
        scriptNode.setAttribute("data-term", id);
        scriptNode.setAttribute("data-reactions-enabled", "1");
        scriptNode.setAttribute("data-emit-metadata", "0");
        scriptNode.setAttribute("data-theme", theme);
        scriptNode.setAttribute("data-lang", lang);
        scriptNode.setAttribute("crossorigin", "anonymous");
        scriptNode.setAttribute("async", "true");
        // Clear other comment nodes' giscus class
        var commentNodes = this.document.querySelectorAll('.giscus');
        for (var i = 0, len = commentNodes.length; i < len; i++) {
            commentNodes[i].classList.remove('giscus');
        }
        // Find or create
      var commentNode = this.document.querySelector('.gk0wk-giscus[tiddler-title="' + id.replace('"', '\\"') + '"]');
      if (!commentNode) {
        commentNode = this.document.createElement('div');
        commentNode.setAttribute('class', 'giscus gk0wk-giscus');
        commentNode.setAttribute('tiddler-title', id);
        parent.insertBefore(commentNode, nextSibling);
        this.domNodes.push(commentNode);
      }
        parent.insertBefore(scriptNode, nextSibling);
        this.domNodes.push(scriptNode);
    };
    GiscusNodeWidget.prototype.execute = function() {};
    GiscusNodeWidget.prototype.refresh = function() {
        var changedAttributes = this.computeAttributes();
        if (Object.keys(changedAttributes).length > 0) {
            this.refreshSelf();
            return true;
        } else {
            return false;
        }
    };
    exports.giscus = GiscusNodeWidget;
})();
