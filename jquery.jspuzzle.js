/*
* jquery.jspuzzle.js
* jQuery Photo Puzzle Plugin
* http://duncanmcintyre.net/plugins/jspuzzle-1-0/
*
* Copyright (c) 2011 Duncan McIntyre http://duncanmcintyre.net
* 1.0
* Dual licensed under the MIT and GPL licenses.
*/

(function ($) {
    $.fn.jspuzzle = function (options) {
        var settings = {
            rows: 5,
            columns: 5,
            emptyColor: '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6),
            slideSpeed: 300
        };

        var methods = {
            init: function (obj) {
                var imageholder = $(obj);
                var image = $($(obj).find("img"));
                var currleft;
                var currtop;
                puzzlepiece.width = parseInt(image.width() / settings.columns);
                puzzlepiece.height = parseInt(image.height() / settings.rows);
                var puzzle = document.createElement('div');
                puzzle.id = "jspuzzle";
                imageholder.append(puzzle);
                for (var ir = 0; ir < settings.rows; ir++) {
                    var top = (ir == 0 ? 0 : top += puzzlepiece.height);
                    for (var ic = 0; ic < settings.columns; ic++) {
                        var left = (ic == 0 ? 0 : left += puzzlepiece.width);
                        var newPuzzlePiece = document.createElement('div');

                        if ((ir == settings.rows - 1) && (ic == settings.columns - 1)) {
                            newPuzzlePiece.id = "ppempty";
                            newPuzzlePiece.style.background = settings.emptyColor;
                            newPuzzlePiece.style.zIndex = -1;
                            newPuzzlePiece.style.backgroundImage = "url()";
                        }
                        else {
                            newPuzzlePiece.id = "pp" + ir + ic;
                            newPuzzlePiece.style.backgroundImage = "url(\"" + image.attr("src") + "\")";
                        }


                        currleft = (ic == 0 ? 0 : (0 - left));
                        currtop = (ir == 0 ? 0 : (0 - top));
                        puzzlepiece.bgX.push(currleft);
                        puzzlepiece.bgY.push(currtop);
                        puzzlepiece.position.left.push(currleft);
                        puzzlepiece.position.top.push(currtop);
                        $(puzzle).append(newPuzzlePiece);

                        newPuzzlePiece = $(newPuzzlePiece);
                        newPuzzlePiece.addClass("jspuzzlepiece");
                        newPuzzlePiece.css("top", top);
                        newPuzzlePiece.css("left", left);
                        newPuzzlePiece.css("position", "absolute");
                        newPuzzlePiece.css("cursor", "pointer");
                        newPuzzlePiece.width(puzzlepiece.width);
                        newPuzzlePiece.height(puzzlepiece.height);
                        newPuzzlePiece.css("background-position", (ic == 0 ? 0 : (0 - left)) + "px " + (ir == 0 ? 0 : (0 - top)) + "px");
                        newPuzzlePiece.hover(function (e) { puzzlepiece.mouseover(e); }, function (e) { puzzlepiece.mouseout(e); });
                        newPuzzlePiece.click(function (e) { puzzlepiece.click(e); });
                    }
                }
                puzzlepiece.all = $(".jspuzzlepiece");
                puzzlepiece.length = puzzlepiece.all.length;
                image.css("position", "asolute");
                image.hide();
                methods.scramble();

                //$(puzzle).css("background", "#fff");
                //$(puzzle).width(image.width());
                //$(puzzle).height(image.height());
                //$("#ppempty").css("background-image", "none");
                //$("#ppempty").css("opacity", "0.20");

            },
            scramble: function () {
                var iindex = 0;
                for (var i = 0; i < ((settings.columns * settings.rows) - 1); i++) {
                    do {
                        puzzlepiece.random = Math.floor(Math.random() * (settings.rows * settings.columns));
                    }
                    while ($.inArray(puzzlepiece.random, puzzlepiece.scrammbled) != -1)
                    if (puzzlepiece.random == ((settings.columns * settings.rows) - 1)) {
                        do {
                            puzzlepiece.random = Math.floor(Math.random() * (settings.rows * settings.columns));
                        }
                        while (puzzlepiece.random == ((settings.columns * settings.rows) - 1))
                    }
                    try {
                        puzzlepiece.scrammbled.push(puzzlepiece.random);
                        var randomTop = $(puzzlepiece.all[puzzlepiece.random]).position().top;
                        var iindexTop = $(puzzlepiece.all[iindex]).position().top;
                        var randomLeft = $(puzzlepiece.all[puzzlepiece.random]).position().left;
                        var iindexLeft = $(puzzlepiece.all[iindex]).position().left;
                        $(puzzlepiece.all[iindex]).css("top", randomTop).attr("puzzlepiecetop", randomTop);
                        $(puzzlepiece.all[iindex]).css("left", randomLeft).attr("puzzlepieceleft", randomLeft);
                        $(puzzlepiece.all[puzzlepiece.random]).css("top", iindexTop).attr("puzzlepiecetop", iindexTop);
                        $(puzzlepiece.all[puzzlepiece.random]).css("left", iindexLeft).attr("puzzlepieceleft", iindexLeft);
                        //$(puzzlepiece.all[iindex]).animate({ top: randomTop, left: randomLeft }, settings.slideSpeed);
                        //$(puzzlepiece.all[puzzlepiece.random]).animate({ top: iindexTop, left: iindexLeft }, settings.slideSpeed);
                        //$(puzzlepiece.all[iindex]).css("background-position", puzzlepiece.bgX[puzzlepiece.random] + "px " + puzzlepiece.bgY[puzzlepiece.random] + "px");
                        iindex += 1;
                    }
                    catch (e) {
                        var ex = e;
                    }
                }
            }
        };

        var puzzlepiece = {
            width: 0,
            height: 0,
            length: 0,
            random: 0,
            scrammbled: new Array(),
            bgX: new Array(),
            bgY: new Array(),
            position: {
                top: new Array(),
                left: new Array()
            },
            all: null,
            mouseover: function (e) {
                var srcE = (e.srcElement != undefined ? e.srcElement : e.target);
                var element = $((srcE != undefined ? srcE : "#" + e.id));
                element.css("opacity", "0.7");
            },
            mouseout: function (e) {
                var srcE = (e.srcElement != undefined ? e.srcElement : e.target);
                var element = $((srcE != undefined ? srcE : "#" + e.id));
                element.css("opacity", "1.0");
            },
            click: function (e) {
                var ppempty = $("#ppempty");
                var srcE = (e.srcElement != undefined ? e.srcElement : e.target);
                var element = $((srcE != undefined ? srcE : "#" + e.id));
                //IF CLICKED ELEMENT IS ABOVE THE EMPTY PIECE
                if (((element.position().top + element.height()) == ppempty.position().top) && element.position().left == ppempty.position().left) {
                    var emptypiece = ppempty.position().top;
                    var clickedpiece = element.position().top;
                    element.animate({ top: emptypiece }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece);
                    ppempty.animate({ top: clickedpiece }, settings.slideSpeed).attr("puzzlepiecetop", clickedpiece);
                }
                //IF CLICKED ELEMENT IS ON THE LEFT SIDE OF THE EMPTY PIECE
                else if (((element.position().left + element.width()) == ppempty.position().left) && element.position().top == ppempty.position().top) {
                    var emptypiece = ppempty.position().left;
                    var clickedpiece = element.position().left;
                    element.animate({ left: emptypiece }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece);
                    ppempty.animate({ left: clickedpiece }, settings.slideSpeed).attr("puzzlepieceleft", clickedpiece);
                }
                //IF CLICKED ELEMENT IS BELOW THE EMPTY PIECE
                else if ((element.position().top == (ppempty.position().top + ppempty.height())) && element.position().left == ppempty.position().left) {
                    var emptypiece = ppempty.position().top;
                    var clickedpiece = element.position().top;
                    element.animate({ top: emptypiece }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece);
                    ppempty.animate({ top: clickedpiece }, settings.slideSpeed).attr("puzzlepiecetop", clickedpiece);
                }
                //IF CLICKED ELEMENT IS ON THE RIGHT SIDE THE EMPTY PIECE
                else if ((element.position().left == (ppempty.position().left + ppempty.width())) && element.position().top == ppempty.position().top) {
                    var emptypiece = ppempty.position().left;
                    var clickedpiece = element.position().left;
                    element.animate({ left: emptypiece }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece);
                    ppempty.animate({ left: clickedpiece }, settings.slideSpeed).attr("puzzlepieceleft", clickedpiece);
                }
                //IF CLICKED ELEMENT IS THE 2ND PIECE ABOVE THE EMPTY PIECE
                else if (((element.position().top + (element.height() * 2)) == ppempty.position().top) && element.position().left == ppempty.position().left) {
                    var nextelement = $(".jspuzzlepiece[puzzlepiecetop='" + (element.position().top + element.height()) + "'][puzzlepieceleft='" + (element.position().left) + "']");
                    var emptypiece = ppempty.position().top;
                    var clickedpiece = element.position().top;
                    element.animate({ top: emptypiece - element.height() }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece - element.height());
                    nextelement.animate({ top: emptypiece }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece);
                    ppempty.animate({ top: clickedpiece }, settings.slideSpeed).attr("puzzlepiecetop", clickedpiece);
                }
                //IF CLICKED ELEMENT IS THE 2ND PIECE ON THE LEFT SIDE OF THE EMPTY PIECE
                else if (((element.position().left + (element.width() * 2)) == ppempty.position().left) && element.position().top == ppempty.position().top) {
                    var nextelement = $(".jspuzzlepiece[puzzlepiecetop='" + (element.position().top) + "'][puzzlepieceleft='" + (element.position().left + element.width()) + "']");
                    var emptypiece = ppempty.position().left;
                    var clickedpiece = element.position().left;
                    element.animate({ left: emptypiece - element.width() }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece - element.width());
                    nextelement.animate({ left: emptypiece }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece);
                    ppempty.animate({ left: clickedpiece }, settings.slideSpeed).attr("puzzlepieceleft", clickedpiece);
                }
                //IF CLICKED ELEMENT IS THE 2ND PIECE BELOW THE EMPTY PIECE
                else if ((element.position().top == (ppempty.position().top + (ppempty.height() * 2))) && element.position().left == ppempty.position().left) {
                    var nextelement = $(".jspuzzlepiece[puzzlepiecetop='" + (element.position().top - element.height()) + "'][puzzlepieceleft='" + (element.position().left) + "']");
                    //nextelement.css("border", "solid 2px #fff");
                    var emptypiece = ppempty.position().top;
                    var clickedpiece = element.position().top;
                    element.animate({ top: emptypiece + element.height() }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece + element.height());
                    nextelement.animate({ top: emptypiece }, settings.slideSpeed).attr("puzzlepiecetop", emptypiece);
                    ppempty.animate({ top: clickedpiece }, settings.slideSpeed).attr("puzzlepiecetop", clickedpiece);
                }
                //IF CLICKED ELEMENT IS THE 2ND PIECE ON THE RIGHT SIDE THE EMPTY PIECE
                else if ((element.position().left == (ppempty.position().left + (ppempty.width() * 2))) && element.position().top == ppempty.position().top) {
                    var nextelement = $(".jspuzzlepiece[puzzlepiecetop='" + (element.position().top) + "'][puzzlepieceleft='" + (element.position().left - element.width()) + "']");
                    //nextelement.css("border", "solid 2px #fff");
                    var emptypiece = ppempty.position().left;
                    var clickedpiece = element.position().left;
                    element.animate({ left: emptypiece + element.width() }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece + element.width());
                    nextelement.animate({ left: emptypiece }, settings.slideSpeed).attr("puzzlepieceleft", emptypiece);
                    ppempty.animate({ left: clickedpiece }, settings.slideSpeed).attr("puzzlepieceleft", clickedpiece);
                }


                //TODO: Have to finalize this part here where the user should be prompted for completing the puzzle...
                var perfect = puzzlepiece.all.length;
                puzzlepiece.all.each(function (i) {
                    if (($(puzzlepiece.all[i]).position().left != puzzlepiece.position.left[i]) || ($(puzzlepiece.all[i]).position().top != puzzlepiece.position.top[i])) {
                        perfect -= 1;
                    }
                });

                if (perfect == puzzlepiece.all.length)
                    alert("Congratulations you just won a ticket to the sun!!!");
            }
        };

        $.extend(settings, options);
        var obj = this;
        if (options && typeof options === 'object') {
            setTimeout(function () { methods.init(obj); }, 1000);
        }
        else if (typeof options === 'string') {

        }

    };
})(jQuery);