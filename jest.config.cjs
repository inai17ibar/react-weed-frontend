module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: [
      "js"
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
  };