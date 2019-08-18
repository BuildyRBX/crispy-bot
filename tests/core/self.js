const jasmine = require('./');

describe('core', () => {
	describe('value provider', () => {
		describe('getFloat', () => {
			it('returns a number', () => {
				expect(typeof jasmine.getFloat()).toBe('number');
			});
			it('always returns within a range', () => {
				let num;
				for (let i = 0; i < 1000; i++) {
					num = jasmine.getFloat(1, 10);
					expect(num).toBeGreaterThanOrEqual(1);
					expect(num).toBeLessThanOrEqual(10);
				}
			});
			it('can return a floating-point number', () => {
				let num;
				let failing = true;
				for (let i = 0; i < 1000 && failing; i++) {
					num = jasmine.getFloat(1, 10);
					if (num !== Math.floor(num))
						failing = false;
				}
				if (failing)
					fail();
			});
		});

		describe('getInt', () => {
			it('returns a number', () => {
				expect(typeof jasmine.getInt()).toBe('number');
			});
			it('always returns within a range', () => {
				let num;
				for (let i = 0; i < 1000; i++) {
					num = jasmine.getInt(1, 10);
					expect(num).toBeGreaterThanOrEqual(1);
					expect(num).toBeLessThanOrEqual(10);
				}
			});
			it('never returns a floating-point number', () => {
				let num;
				let failing = true;
				for (let i = 0; i < 1000 && failing; i++) {
					num = jasmine.getInt(1, 10);
					if (num === Math.floor(num))
						failing = false;
				}
				if (failing)
					fail();
			});
		});

		describe('getString', () => {
			it('returns a string', () => {
				expect(typeof jasmine.getString()).toBe('string');
			});
			it('always returns a string within range', () => {
				let point;
				for (let i = 0; i < 1000; i++) {
					point = jasmine.getString(1, 1, 'AJ').codePointAt(0);
					expect(point).toBeGreaterThanOrEqual(65);
					expect(point).toBeLessThanOrEqual(74);
				}
			});
			it('always returns a string within the min and max length', () => {
				let len;
				for (let i = 0; i < 1000; i++) {
					len = jasmine.getString(1, 10).length;
					expect(len).toBeGreaterThanOrEqual(1);
					expect(len).toBeLessThanOrEqual(10);
				}
			});
		});

		describe('getFrom', () => {
			it('throws for non-array paramater', () => {
				expect(function() { jasmine.getFrom(Symbol()); }).toThrow();
			});
			it('gets a single value', () => {
				let value = Symbol();
				expect(jasmine.getFrom([value])).toBe(value);
			});
			it('gets all values', () => {
				let values = [Symbol(), Symbol()];
				let value;
				let gotFirst = false;
				let gotSecond = false;
				for (let i = 0; i < 200 && (!gotFirst || !gotSecond); i++) {
					value = jasmine.getFrom(values);
					if (value === values[0])
						gotFirst = true;
					else if (value === values[1])
						gotSecond = true;
				}
				if (!gotFirst || !gotSecond)
					fail();
			});
		});
	});

	describe('mocking', () => {
		it('requires a mocked file', () => {
			try {
				let str = jasmine.getString();
				expect(require('echoTest1.js')(str)).toBe('test ' + str);
			} catch (err) {
				fail(err.message);
			}
		});
		it('requires a mocked file without an extension', () => {
			try {
				let str = jasmine.getString();
				expect(require('echoTest1')(str)).toBe('test ' + str);
			} catch (err) {
				fail(err.message);
			}
		});
		it('requires a mocked folder', () => {
			try {
				let str = jasmine.getString();
				expect(require('echoTest2')(str)).toBe('test ' + str);
			} catch (err) {
				fail(err.message);
			}
		});
	});
});
