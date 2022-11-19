var fs = require('fs');
var path = require('path');

const resolve = p => {
  return path.resolve(__dirname, '../', p);
}

function getFiles(dirname) {
  const files = fs.readdirSync(resolve(dirname));
  console.dir(files);
  return files;
}


module.exports = function createSidebar(dirs = []) {
  let sidebar = {};
  for (let d of dirs) {
    let dir = d.dir || '';
    let key = '/' + dir;
    let title = d.title || '';
    sidebar[key] = [];

    let one = {
      title: title,
      sidebarDepth: 2
    }
    let files = getFiles(dir);
    files = Array.from(files);
    files = files.map(filename => {
      console.log(filename);
      return filename.replace('.md', '');
    });

    // 将根文件放在第一位
    let index = files.findIndex(el => dir.indexOf(el) !== -1);
    if (index !== -1) {
      let tmp = files[index];
      files[index] = files[0];
      files[0] = tmp;
    }

    one.children = files;

    sidebar[key].push(one);
  }

  console.log(JSON.stringify(sidebar));

  return sidebar;
//
//   "/blogs/tool/"
// :
//   [
//     {
//       title: 'tool.js',
//       sidebarDepth: 2,
//       children: [
//         'profile',
//         'Timer'
//       ]
//     }
//   ]
}