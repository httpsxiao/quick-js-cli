const path = require('path')
const fs = require('fs-extra')

function deleteRemovedFiles (dir, files, previousFiles) {
  const filesToDelete = Object.keys(previousFiles)
    .filter(filename => !files[filename])

  return Promise.all(filesToDelete.map(filename => {
    return fs.unlink(path.join(dir, filename))
  }))
}

exports.writeFileTree = async (dir, files, previousFiles) => {
  if (previousFiles) {
    await deleteRemovedFiles(dir, files, previousFiles)
  }
  
  Object.keys(files).forEach(name => {
    const filePath = path.join(dir, name)
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath, files[name])
  })
}
