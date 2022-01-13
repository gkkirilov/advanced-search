if (document.getElementById("appbar")) {
    fetch(chrome.runtime.getURL("main.html")).then(response => response.text()).then(html => {
        document.getElementById("appbar").innerHTML = html;
    }).then(() => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        if (params && params.q && params.q.includes('site:')) {
            $('.dropdown-toggle-site')[0].innerText = params.q.match(/site:\S+/g)[0].replace('site:', '');
        } else {
            $('.any-site').css({ display: 'none' });
        }

        if (params && params.tbs) {
            console.log(params.tbs.split(':')[1])
            var timeMap = {
                "a": "Any Time",
                "h": "1 Hour",
                "d": "1 Day",
                "w": "1 Week",
                "m": "1 Month",
                "6m": "6 Months",
                "y": "1 Year",
                "3y": "3 Years",
                "10y": "10 Years"
            }
            console.log(timeMap.m)
            console.log($('.dropdown-toggle-time'))
            $('.dropdown-toggle-time')[0].innerText = timeMap[params.tbs.split(':')[1]];
        } else {
            $('.any-time').css({ display: 'none' });
        }

        function generateMustIncludeHTML(params) {
            var html = "";
            for (var i = 0; i < params.length; i++) {
                html += "<div class='must-include-word py-1 px-0.5 rounded-md inline text-slate-400 hover:bg-slate-500 hover:text-slate-200'>" + params[i] + "</div>";
            }
            return html;
        }

        String.prototype.insert = function (index, string) {
            if (index > 0) {
                return this.substring(0, index) + string + this.substr(index);
            }

            return string + this;
        };

        var mustIncludeHTML = generateMustIncludeHTML(params.q.split(' ').filter(el => !el.includes('site:')));
        $('.must-include').html(mustIncludeHTML);

        $(document).ready(function () {
            $(".selectable").selectable({
                stop: function (event, ui) {
                    var a = $(".ui-selected")
                    var words = []
                    a.each((i, el) => {
                        words.push(el.innerText);
                    })
                    var mustIncludePhrase = words.join(' ');
                    var startIndex = params.q.indexOf(mustIncludePhrase);
                    params.q = params.q.insert(startIndex, '"')
                    params.q = params.q.insert(startIndex + mustIncludePhrase.length + 1, '"')
                    window.location.search = new URLSearchParams(params).toString();
                }
            });

            $(".dropdown-toggle-site-main .drop-list__btn").on('click', function (e) {
                if ($(this).text() == "Any Site") {
                    params.q = params.q.split(' ').filter((item) => !item.includes('site:')).join(' ')
                } else if (params && params.q && params.q.includes('site:')) {
                    var a = params.q.split(' ').filter((item) => !item.includes('site:')).join(' ')
                    params.q = a + ' site:' + $(this).text().trim();
                } else {
                    params.q = params.q + ' site:' + $(this).text().trim();
                }
                window.location.search = new URLSearchParams(params).toString();
            });

            $(".dropdown-toggle-time-main .drop-list__btn").on('click', function () {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                console.log($(this).text())
                if ($(this).text() == "Any Time") {
                    delete params.tbs;
                } else {
                    params.tbs = "qdr:" + $(this).data("code");
                }
                window.location.search = new URLSearchParams(params).toString();
            });
        });
    });
}
