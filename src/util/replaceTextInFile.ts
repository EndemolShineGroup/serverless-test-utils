import fs from 'fs';

export default (filePath: string, subString: string, newSubString: string) => {
  const fileContent = fs.readFileSync(filePath).toString();
  fs.writeFileSync(filePath, fileContent.replace(subString, newSubString));
};
