module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js"
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
  };