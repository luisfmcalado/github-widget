"use strict";
window.gitwidget = (function () {

  var api_url = "https://api.github.com/";
  var github_url = "https://github.com/";

  function fins(elem, doc){
    elem.innerHTML = doc.innerHTML;
    elem.style.visibility = 'visible';
  }

  function renderWidget(parent, result) {
    var elem = document.getElementById(parent.selector);
    var doc = document.createElement("div");
    template(parent.theme, function(templ){
        setTimeout(function(){
          srepo(0, result.length, parent, elem, templ, doc, result);
        }, 50);
      });
  }

  function srepo(i, length, parent, elem, templ, doc, result){

    if(i >= length) {
      fins(elem, doc);
      return;
    }

      var repo = document.createElement("div");
      repo.innerHTML = templ;
      repo.getElementsByClassName("gitrepo")[0].id = i;

      var repolink = repo.getElementsByClassName("repolink");
      if (repolink.length > 0){
        repolink[0].href = result[i].html_url;
        repolink[0].innerHTML = result[i].name;
      }

      var stargazerscount = repo.getElementsByClassName("stargazerscount");
      if (stargazerscount.length > 0){
        stargazerscount[0].innerHTML = result[i].stargazers_count;
      }

      var forkscount = repo.getElementsByClassName("forkscount");
      if (forkscount.length > 0){
        forkscount[0].innerHTML = result[i].forks_count;
      }

      var createdby = repo.getElementsByClassName("createdby");
      if (createdby.length > 0){
        createdby[0].href =  github_url + parent.username;
        createdby[0].innerHTML =  result[i].owner.login;
      }

      var description = repo.getElementsByClassName("description");
      if (description.length > 0){
        description[0].innerHTML = result[i].description;
      }
      doc.appendChild(repo);

    setTimeout(function(){ srepo(i+1, result.length, parent, elem, templ, doc, result); }, 50);
  }

  function template(url, callback) {

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
      callback(r.responseText);
    };

    r.open("GET", url, true);
    r.send();
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
