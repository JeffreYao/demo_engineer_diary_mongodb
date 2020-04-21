const XlsxPopulate = require('xlsx-populate');
const fontStyle = require('./populate_style');
const { countWorkCategory } = require('./func');


// const fakeFile = [{
//   _id: '5e44c62d4485d6301078cdb6',
//   createAt: '2020-02-13',
//   workDate: '2020-02-26',
//   workCategory: '代管設定',
//   workDescription: 'AP代管',
//   userId: '5e423df03fbd5951042a3786',
//   __v: 0
// },
// {
//   _id: '6e44c62d4485d6301078cdb6',
//   createAt: '2020-02-13',
//   workDate: '2020-02-28',
//   workCategory: '資安設定',
//   workDescription: '修改防火牆',
//   userId: '5e423df03fbd5951042a3786',
//   __v: 0
// }
// ]


const xlsxDownload = (data, username, dateByMonth) => {
  XlsxPopulate.fromFileAsync("./維護報告與工作日誌_標準格式.xlsx")
    .then(workbook => {
      const workListNum = data.length;
      const signSpaceNum = workListNum + 9;
      const sheet0 = workbook.sheet("統計資料");
      const sheet1 = workbook.sheet("日誌");
      const formYear = dateByMonth.split("-")[0];
      const formMonth = dateByMonth.split("-")[1][1];
      const curMonthDays = new Date(formYear, formMonth, 0).getDate();
      const dateRange = `${formYear}-${formMonth}-1 至 ${formYear}-${formMonth}-${curMonthDays}`;
      console.log(dateRange);
      const sortCountWorkCategory = countWorkCategory(data); //產生新的category object
      //第五列表頭
      sheet0.cell("E5")
        .value(`${dateRange}`)
        .style(fontStyle.nonBorderStyle);
      sheet0.cell("G5")
        .value(`${username}`)
        .style(fontStyle.nonBorderStyle);
      sheet0.cell("H5")
        .value(`共${workListNum}筆`)
        .style(fontStyle.nonBorderStyle);


      //從DB寫入每筆資料sheet0
      data.forEach((item, index) => {
        const numberA = index + 1;
        const startColumn = index + 7;
        const formDate = (item.workDate).toISOString().split('T')[0];
        // console.log(formDate)
        //A欄位:編號
        sheet0.cell(`A${startColumn}`)
          .value(`${numberA}`)
          .style(fontStyle.centerStyle);

        //B欄位:人員
        sheet0.cell(`B${startColumn}`)
          .value(`${username}`)
          .style(fontStyle.centerStyle);

        //CD欄位:起訖時間
        sheet0.range(`C${startColumn}:D${startColumn}`)
          .value(`${formDate} -${formDate}`)
          .style(fontStyle.centerStyle)
          .merged(true);

        //E欄位:工作分類
        sheet0.cell(`E${startColumn}`)
          .value(`${item.workCategory}`)
          .style(fontStyle.centerStyle);

        //FGHI欄位:敘述
        sheet0.range(`F${startColumn}:I${startColumn}`)
          .value(`${item.workDescription}`)
          .style(fontStyle.leftStyle)
          .merged(true);
      });
      //簽名欄位
      sheet0.cell(`C${signSpaceNum}`)
        .value("客戶簽章：________________")
        .style(fontStyle.centerNonBorderStyle);
      sheet0.cell(`F${signSpaceNum}`)
        .value("公司主管：________________")
        .style(fontStyle.centerNonBorderStyle);

      //##第二個分頁
      //第五列表頭
      sheet1.cell("C5")//時間範圍
        .value(`${dateRange}`)
        .style(fontStyle.nonBorderStyle);
      sheet1.cell("G5")//人員
        .value(`${username}`)
        .style(fontStyle.nonBorderStyle);
      sheet1.cell("H5")//筆數
        .value(`共${workListNum}筆`)
        .style(fontStyle.nonBorderStyle);

      let index = 0;
      // //從DB寫入每筆資料sheet1
      for (let key in sortCountWorkCategory) {
        console.log(key);
        const numberA = index + 1;
        const startColumn = index + 7;
        //A欄位:編號
        sheet1.cell(`A${startColumn}`)
          .value(`${numberA}`)
          .style(fontStyle.centerStyle);

        //CD欄位:起訖時間
        sheet1.range(`B${startColumn}:H${startColumn}`)
          .value(`${key}`)
          .style(fontStyle.leftStyle)
          .merged(true);

        //I欄位:次數
        sheet1.cell(`I${startColumn}`)
          .value(`${sortCountWorkCategory[key]}`)
          .style(fontStyle.centerStyle);
        index += 1;
      };

      const dataLength = Object.keys(sortCountWorkCategory).length;
      console.log(dataLength);
      //簽名欄位
      sheet1.cell(`C${dataLength + 9}`)
        .value("客戶簽章：________________")
        .style(fontStyle.centerNonBorderStyle);
      sheet1.cell(`F${dataLength + 9}`)
        .value("公司主管：________________")
        .style(fontStyle.centerNonBorderStyle);

      workbook.toFileAsync(`./public/${formMonth}月份維護報告與工作日誌_${username}.xlsx`)
    })
};





module.exports = { xlsxDownload };







