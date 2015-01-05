/**
 * @author Geert Fokke [geert@sector22.com]
 * @www sector22.com
 * @module sector22/utils/key
 */

// @formatter:off

/**
 * @namespace
 * @property {number} BACKSPACE 	- Corresponding key code for this button.
 * @property {number} TAB			- Corresponding key code for this button.
 * @property {number} ENTER			- Corresponding key code for this button.
 * @property {number} SHIFT			- Corresponding key code for this button.
 * @property {number} CTRL			- Corresponding key code for this button.
 * @property {number} ALT			- Corresponding key code for this button.
 * @property {number} CAPS_LOCK		- Corresponding key code for this button.
 * @property {number} ESCAPE		- Corresponding key code for this button.
 * @property {number} SPACE			- Corresponding key code for this button.

 * @property {number} ARROW_LEFT	- Corresponding key code for this button.
 * @property {number} ARROW_UP		- Corresponding key code for this button.
 * @property {number} ARROW_RIGHT	- Corresponding key code for this button.
 * @property {number} ARROW_DOWN	- Corresponding key code for this button.

 * @property {number} PAUSE_BREAK	- Corresponding key code for this button.
 * @property {number} PRINT_SCREEN	- Corresponding key code for this button.
 * @property {number} INSERT		- Corresponding key code for this button.
 * @property {number} DELETE		- Corresponding key code for this button.
 * @property {number} HOME			- Corresponding key code for this button.
 * @property {number} END			- Corresponding key code for this button.
 * @property {number} PAGE_UP		- Corresponding key code for this button.
 * @property {number} PAGE_DOWN		- Corresponding key code for this button.

 * @property {number} NUM_0			- Corresponding key code for this button.
 * @property {number} NUM_1			- Corresponding key code for this button.
 * @property {number} NUM_2			- Corresponding key code for this button.
 * @property {number} NUM_3			- Corresponding key code for this button.
 * @property {number} NUM_4			- Corresponding key code for this button.
 * @property {number} NUM_5			- Corresponding key code for this button.
 * @property {number} NUM_6			- Corresponding key code for this button.
 * @property {number} NUM_7			- Corresponding key code for this button.
 * @property {number} NUM_8			- Corresponding key code for this button.
 * @property {number} NUM_9			- Corresponding key code for this button.

 * @property {number} A				- Corresponding key code for this button.
 * @property {number} B				- Corresponding key code for this button.
 * @property {number} C				- Corresponding key code for this button.
 * @property {number} D				- Corresponding key code for this button.
 * @property {number} E				- Corresponding key code for this button.
 * @property {number} F				- Corresponding key code for this button.
 * @property {number} G				- Corresponding key code for this button.
 * @property {number} H				- Corresponding key code for this button.
 * @property {number} I				- Corresponding key code for this button.
 * @property {number} J				- Corresponding key code for this button.
 * @property {number} K				- Corresponding key code for this button.
 * @property {number} L				- Corresponding key code for this button.
 * @property {number} M				- Corresponding key code for this button.
 * @property {number} N				- Corresponding key code for this button.
 * @property {number} O				- Corresponding key code for this button.
 * @property {number} P				- Corresponding key code for this button.
 * @property {number} Q				- Corresponding key code for this button.
 * @property {number} R				- Corresponding key code for this button.
 * @property {number} S				- Corresponding key code for this button.
 * @property {number} T				- Corresponding key code for this button.
 * @property {number} U				- Corresponding key code for this button.
 * @property {number} V				- Corresponding key code for this button.
 * @property {number} W				- Corresponding key code for this button.
 * @property {number} X				- Corresponding key code for this button.
 * @property {number} Y				- Corresponding key code for this button.
 * @property {number} Z				- Corresponding key code for this button.

 * @property {number} NUMPAD_0		- Corresponding key code for this button.
 * @property {number} NUMPAD_1		- Corresponding key code for this button.
 * @property {number} NUMPAD_2		- Corresponding key code for this button.
 * @property {number} NUMPAD_3		- Corresponding key code for this button.
 * @property {number} NUMPAD_4		- Corresponding key code for this button.
 * @property {number} NUMPAD_5		- Corresponding key code for this button.
 * @property {number} NUMPAD_6		- Corresponding key code for this button.
 * @property {number} NUMPAD_7		- Corresponding key code for this button.
 * @property {number} NUMPAD_8		- Corresponding key code for this button.
 * @property {number} NUMPAD_9		- Corresponding key code for this button.

 * @property {number} MULTIPLY		- Corresponding key code for this button.
 * @property {number} ADD			- Corresponding key code for this button.
 * @property {number} SUBTRACT		- Corresponding key code for this button.
 * @property {number} DECIMAL_POINT	- Corresponding key code for this button.
 * @property {number} DIVIDE		- Corresponding key code for this button.

 * @property {number} F1			- Corresponding key code for this button.
 * @property {number} F2			- Corresponding key code for this button.
 * @property {number} F3			- Corresponding key code for this button.
 * @property {number} F4			- Corresponding key code for this button.
 * @property {number} F5			- Corresponding key code for this button.
 * @property {number} F6			- Corresponding key code for this button.
 * @property {number} F7			- Corresponding key code for this button.
 * @property {number} F8			- Corresponding key code for this button.
 * @property {number} F9			- Corresponding key code for this button.
 * @property {number} F10			- Corresponding key code for this button.
 * @property {number} F11			- Corresponding key code for this button.
 * @property {number} F12			- Corresponding key code for this button.

 * @property {number} NUM_LOCK		- Corresponding key code for this button.
 * @property {number} SCROLL_LOCK	- Corresponding key code for this button.
 * @property {number} SEMI_COLON	- Corresponding key code for this button.
 * @property {number} COMMA			- Corresponding key code for this button.
 * @property {number} DASH			- Corresponding key code for this button.
 * @property {number} PERIOD		- Corresponding key code for this button.
 * @property {number} FORWARD_SLASH	- Corresponding key code for this button.
 * @property {number} OPEN_BRACKET	- Corresponding key code for this button.
 * @property {number} CLOSE_BRACKET	- Corresponding key code for this button.
 * @property {number} BACK_SLASH	- Corresponding key code for this button.
 * @property {number} SINGLE_QUOTE	- Corresponding key code for this button.
 */
var KeyCode = {}

KeyCode.BACKSPACE 		= 8;
KeyCode.TAB				= 9;
KeyCode.ENTER			= 13;
KeyCode.SHIFT			= 16;
KeyCode.CTRL			= 17;
KeyCode.ALT				= 18;
KeyCode.CAPS_LOCK		= 20;
KeyCode.ESCAPE			= 27;
KeyCode.SPACE			= 32;

KeyCode.ARROW_LEFT		= 37;
KeyCode.ARROW_UP		= 38;
KeyCode.ARROW_RIGHT		= 39;
KeyCode.ARROW_DOWN		= 40;
 
KeyCode.PAUSE_BREAK		= 19;
KeyCode.PRINT_SCREEN	= 44;
KeyCode.INSERT			= 45;
KeyCode.DELETE			= 46;
KeyCode.HOME			= 36;
KeyCode.END				= 35;
KeyCode.PAGE_UP			= 33;
KeyCode.PAGE_DOWN		= 34;
 
KeyCode.NUM_0			= 48;
KeyCode.NUM_1			= 49;
KeyCode.NUM_2			= 50;
KeyCode.NUM_3			= 51;
KeyCode.NUM_4			= 52;
KeyCode.NUM_5			= 53;
KeyCode.NUM_6			= 54;
KeyCode.NUM_7			= 55;
KeyCode.NUM_8			= 56;
KeyCode.NUM_9			= 57;
 
KeyCode.A				= 65;
KeyCode.B				= 66;
KeyCode.C				= 67;
KeyCode.D				= 68;
KeyCode.E				= 69;
KeyCode.F				= 70;
KeyCode.G				= 71;
KeyCode.H				= 72;
KeyCode.I				= 73;
KeyCode.J				= 74;
KeyCode.K				= 75;
KeyCode.L				= 76;
KeyCode.M				= 77;
KeyCode.N				= 78;
KeyCode.O				= 79;
KeyCode.P				= 80;
KeyCode.Q				= 81;
KeyCode.R				= 82;
KeyCode.S				= 83;
KeyCode.T				= 84;
KeyCode.U				= 85;
KeyCode.V				= 86;
KeyCode.W				= 87;
KeyCode.X				= 88;
KeyCode.Y				= 89;
KeyCode.Z				= 90;
 
KeyCode.NUMPAD_0		= 96;
KeyCode.NUMPAD_1		= 97;
KeyCode.NUMPAD_2		= 98;
KeyCode.NUMPAD_3		= 99;
KeyCode.NUMPAD_4		= 100;
KeyCode.NUMPAD_5		= 101;
KeyCode.NUMPAD_6		= 102;
KeyCode.NUMPAD_7		= 103;
KeyCode.NUMPAD_8		= 104;
KeyCode.NUMPAD_9		= 105;

KeyCode.MULTIPLY		= 106;
KeyCode.ADD				= 107;
KeyCode.SUBTRACT		= 109;
KeyCode.DECIMAL_POINT	= 110;
KeyCode.DIVIDE			= 111;
 
KeyCode.F1				= 112;
KeyCode.F2				= 113;
KeyCode.F3				= 114;
KeyCode.F4				= 115;
KeyCode.F5				= 116;
KeyCode.F6				= 117;
KeyCode.F7				= 118;
KeyCode.F8				= 119;
KeyCode.F9				= 120;
KeyCode.F10				= 121;
KeyCode.F11				= 122;
KeyCode.F12				= 123;
 
KeyCode.NUM_LOCK		= 144;
KeyCode.SCROLL_LOCK		= 145;
KeyCode.SEMI_COLON		= 186;
KeyCode.COMMA			= 188;
KeyCode.DASH			= 189;
KeyCode.PERIOD			= 190;
KeyCode.FORWARD_SLASH	= 191;
KeyCode.OPEN_BRACKET	= 219;
KeyCode.CLOSE_BRACKET	= 221;
KeyCode.BACK_SLASH		= 220;
KeyCode.SINGLE_QUOTE	= 222;


module.exports = KeyCode;

