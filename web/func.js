const fs = require('fs');

//刪除public 資料夾所產生的excel下載檔案
const deleteFile = (username, month) => {
  fs.unlink(`./public/${month}月份維護報告與工作日誌_${username}.xlsx`, (err) => {
    if (err) return console.error(err);
    console.log('File deleted!');
  })
};

//類別計算
const countWorkCategory = (workList) => {
  const categoryList = {};
  const sortCategoryList = {};
  const sortable = [];
  workList.forEach((item, index) => { //取出workCategory
    categoryListToArr = Object.keys(categoryList);

    //如果categoryList無此obj 加入categoryList
    if (categoryListToArr.includes(item.workCategory) === true) {
      return categoryList[item.workCategory] += 1;
    };
    categoryList[item.workCategory] = 1;//{ '代管設定': 0, '資安設定': 0 }
  });
  // sort categoryList
  for (const category in categoryList) {
    sortable.push([category, categoryList[category]]);
  };
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  //寫入sortCategoryList轉成sort 過的資料
  sortable.forEach((item) => {
    sortCategoryList[item[0]] = item[1];
  });

  return sortCategoryList;
};





module.exports = { deleteFile, countWorkCategory };