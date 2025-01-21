import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const PATH = "./data.json";
const git = simpleGit();

const generateRandomDate = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const diffDays = end.diff(start, "days");

  const randomDays = random.int(0, diffDays);
  return start.add(randomDays, "days").format();
};

const writeDataToFile = async (filePath, data) => {
  return new Promise((resolve, reject) => {
    jsonfile.writeFile(filePath, data, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

const commitChanges = async (date) => {
  try {
    await git.add([PATH]);
    await git.commit(date, { "--date": date });
  } catch (error) {
    console.error("Error committing changes:", error);
  }
};

const makeCommits = async (n, startDate, endDate) => {
  if (n <= 0) {
    try {
      await git.push();
      console.log("All commits pushed successfully!");
    } catch (error) {
      console.error("Error pushing commits:", error);
    }
    return;
  }

  const date = generateRandomDate(startDate, endDate);
  console.log("Generated date:", date);

  try {
    await writeDataToFile(PATH, { date });
    await commitChanges(date);
    await makeCommits(n - 1, startDate, endDate);
  } catch (error) {
    console.error("Error during commit process:", error);
  }
};
/////yyyy-mm-dd
makeCommits(10, "2024-01-01", "2024-12-31");
