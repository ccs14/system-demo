import * as Reddit from "./API/Reddit.js";

// debug and test file for when running locally to iterate fast
(async () => {
  try {
    // let res = await Redis.loadSampleData();
    // console.log("🚀 ~ file: index.js:5 ~ res:", res);

    let res = await Reddit.getTopPosts("dotnet", "year");
    console.log("🚀 ~ file: index.js:10 ~ res:", res);

    // const o = {
    //   key1: "value1",
    //   key2: "value2",
    // };

    // await Redis.SetKeyAsync("simple2", JSON.stringify(o));

    // let res1 = await Redis.GetKeyOrNullAsync("test1");
    // console.log("🚀 ~ file: index.js:14 ~ res1:", res1);
    // await Redis.SetKeyAsync("test1", o);
    // let res3 = await Redis.GetKeyOrNullAsync("test1");
    // console.log("🚀 ~ file: index.js:18 ~ res3:", res3);
  } catch (error) {
    console.log("error: ", error);
  }
})();
