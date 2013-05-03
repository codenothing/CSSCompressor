## v0.0.2

**New Rules**
* **Rect Shape**: Compressing rect shape declarations
* **HSL to Hex**: Converts HSL to Hex code
* **HSLA to HSL**: Converts HSLA to HSL when opacity is 1
* **RGBA to RGB**: Converts RGBA to RGB when opacity is 1
* **Calc Units**: Compresses individual units in calc function, and removes whitespace
* **Function Units**: General whitespace removal and unit compression of css functions


**Code Changes**
* Added CI support
* Allowing value rule compressions to only return when they have changes
* Added `CSSCompressor.addRuleCallback` to be notified when new rules are added


## v0.0.1

Initial Release
