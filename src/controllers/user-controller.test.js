const userController = require("./user-controller");


test('should exist and to be typeof function', () => {
    expect(userController).toBeDefined();
    expect(typeof userController).toBe('object');
})
