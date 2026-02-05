(function ($) {
  $(function () {
    function updateHeaderSize() {
      const h = $("#global-head").outerHeight();
      document.documentElement.style.setProperty("--header-h", h + "px");
    }
    updateHeaderSize();
    $(window).on("resize", updateHeaderSize);
    $(".sub-menu.is-active .sub-menu-nav").show();
    $(".sub-menu-head").on("click", function () {
      var $subNav = $(this).next(".sub-menu-nav");
      if ($subNav.is(":visible")) {
        $subNav.velocity("slideUp", { duration: 200 });
        $(this).parent("li").removeClass("is-active");
      } else {
        $subNav.velocity("slideDown", { duration: 200 });
        $(this).parent("li").addClass("is-active");
      }
      return false;
    });
    $("#nav-toggle").on("click", function () {
      $("body").toggleClass("close");
    });
  });
  let enableGiveupPopup = true;
  if ($("#FinishPopup").hasClass("show")) {
    enableGiveupPopup = false;
  }
  let giveupClosable = false;
  function startGiveupPopupTimer() {
    const startTime = Date.now();
    function checkElapsed() {
      const elapsed = Date.now() - startTime;
      if (elapsed >= 10 * 60 * 1e3) {
        if (!enableGiveupPopup) return;
        $("#GiveupPopup").fadeIn().addClass("show");
        giveupClosable = false;
        setTimeout(function () {
          giveupClosable = true;
        }, 3 * 1e3);
        $("#dummyBtn").addClass("giveup-btn").attr("title", "結果を再表示");
      } else {
        setTimeout(checkElapsed, 1e3);
      }
    }
    checkElapsed();
  }
  function showGiveupPopupReplay() {
    $("#GiveupPopup").fadeIn().addClass("show");
    giveupClosable = true;
  }
  $("#GiveupPopup").on("click", function (e) {
    if (e.target === this && giveupClosable) {
      $(this).fadeOut().removeClass("show");
    }
  });
  $(document).on("click", ".giveup-btn", function () {
    showGiveupPopupReplay();
  });
  startGiveupPopupTimer();
})(jQuery);
$(document).on("click", "#addRowBtn", function () {
  const col1 = $("#newCol1").val().trim();
  const col2 = $("#newCol2").val();
  const col3 = $("#newCol3").val().trim();
  const col4 = $("#newCol4").val().trim();
  if (col3 === "" || col4 === "") {
    $("#errorMsg").text("ポート番号が未入力です");
    return;
  }
  const portRegex = /^\d+$/;
  if (!portRegex.test(col3) || !portRegex.test(col4)) {
    $("#errorMsg").text("ポート番号は数字で入力してください");
    return;
  }
  const localIpRegex =
    /^(10\.(\d{1,3}\.){2}\d{1,3})$|^(172\.(1[6-9]|2\d|3[0-1])\.(\d{1,3})\.(\d{1,3}))$|^(192\.168\.(\d{1,3})\.(\d{1,3}))$/;
  const port1 = Number(col3);
  const port2 = Number(col4);
  const isPortValid =
    Number.isInteger(port1) &&
    port1 >= 0 &&
    port1 <= 65535 &&
    Number.isInteger(port2) &&
    port2 >= 0 &&
    port2 <= 65535;
  if (!localIpRegex.test(col1) || !isPortValid) {
    $("#errorMsg").text("入力範囲外です");
    return;
  }
  const isDuplicate = $("#editableTable tbody tr")
    .not("#inputRow")
    .toArray()
    .some((row) => {
      const tds = $(row).find("td");
      return (
        (tds.eq(0).text() === col1 && tds.eq(3).text() === col4) ||
        tds.eq(2).text() === col3
      );
    });
  if (isDuplicate) {
    $("#errorMsg").text("既存ルールと重複しています");
    return;
  }
  $("#errorMsg").text("​");
  const newRow = `\n        <tr class="table">\n            <td>${col1}</td>\n            <td>${col2}</td>\n            <td>${col3}</td>\n            <td>${col4}</td>\n            <td><button class="table delete-btn">削除</button></td>\n        </tr>\n    `;
  $("#editableTable tbody").append(newRow);
  if (
    col1 === "192.168.1.3" &&
    (col2 === "TCP" || col2 === "TCP/UDP") &&
    Number(col3) === 3480 &&
    Number(col4) === 3480
  ) {
    $("#FinishPopup").fadeIn().addClass("show");
  }
  $("#newCol1").val("");
  $("#newCol3").val("");
  $("#newCol4").val("");
});
$(document).on("click", ".delete-btn", function () {
  $(this).closest("tr").remove();
});
