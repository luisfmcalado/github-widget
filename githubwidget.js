"use strict";
window.gitwidget = (function () {

    var api_url = "https://api.github.com/";
    var github_url = "https://github.com/";
		
	function fins(elem){
		elem.style.visibility = 'visible';
	}
		
    function renderWidget(parent, result) {    
        var elem = document.getElementById(parent.selector);
        setTimeout(function(){ 
        	srepo(0, result.length, parent, elem, result); 
        }, 50);
    }

	function srepo(i, length, parent, elem, result){
		
		if(i >= length) {
			fins(elem);
			return;
		}
		
		var frame = document.createElement("iframe");
            frame.src = parent.theme;
            frame.id = "iframe-" + i;
            frame.style.visibility = 'hidden';
            elem.appendChild(frame);

            frame.onload = function () {

                var repotemplate = this.contentWindow.document.body;
                repotemplate.getElementsByClassName("gitrepo")[0].id = this.id;
                elem.replaceChild(repotemplate.getElementsByClassName("gitrepo")[0], this);

                var reponum = this.id.split("-")[1];
                if (document.getElementById(this.id).getElementsByClassName("repolink").length > 0)
                    document.getElementById(this.id).getElementsByClassName("repolink")[0].href = result[reponum].html_url;

                updateField(this.id, "repolink", result[reponum].name);
                updateField(this.id, "stargazerscount", result[reponum].stargazers_count);
                updateField(this.id, "forkscount", result[reponum].forks_count);

                if (document.getElementById(this.id).getElementsByClassName("createdby").length > 0)
                    document.getElementById(this.id).getElementsByClassName("createdby")[0].href = github_url + parent.username;
                updateField(this.id, "createdby", "Created by " + result[reponum].owner.login);
                updateField(this.id, "description", result[reponum].description);
        	}
                
        setTimeout(function(){ srepo(i+1, result.length, parent, elem, result); }, 5);
	}

    function request(parent, url, callback) {

        var r = null;
        if (window.XMLHttpRequest) {
            r = new XMLHttpRequest();
            if (typeof r.overrideMimeType != "undefined") {
                r.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            r = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            return r;
        }

        r.onreadystatechange = function () {
            if (r.readyState != 4) return;
            if (r.status != 200) return;
            callback(parent, JSON.parse(r.responseText));
        };

        r.open("GET", url, true);
        r.send();
    }

    function updateField(id, field, value) {
        var fiel = document.getElementById(id).getElementsByClassName(field);
        if (fiel.length > 0)
            fiel[0].innerHTML = value;
    }

    var gitwidget = {
        selector: "",
        username: "",
        theme: ""
    };

    gitwidget.display = function (selector) {
        var doc = document.getElementById(selector);
        var type = doc.getAttribute("git-type") || "owner";
        var sort = doc.getAttribute("git-sort") || "pushed";
        doc.style.visibility = 'hidden';
        this.theme = doc.getAttribute("git-theme") || "theme.html";
        this.selector = selector;
        this.username = doc.getAttribute("git-username");
        request(this, api_url + "users/" + this.username + "/repos?type=" + type + "&sort=" + sort, renderWidget);
    };

    var widget = document.getElementById("gitwidget");
    if (widget) {
        gitwidget.display("gitwidget");
    }

    return gitwidget;
})();
