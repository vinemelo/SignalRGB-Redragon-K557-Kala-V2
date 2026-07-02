export function Name() { return "Redragon K557 Kala V2"; }
export function VendorId() { return 0x320F; }
export function ProductId() { return [0x5000, 0x5055]; }
export function Publisher() { return "WhirlwindFx"; }
export function Size() { return [22, 6]; }
export function DeviceType(){ return "keyboard"; }
export function Validate(endpoint) { return endpoint.interface === 1; }

export function ControllableParameters(){
	return [
		{property:"LightingMode", group:"lighting", label:"Modo de Iluminação", type:"combobox", values:["Canvas", "Forçado"], default:"Canvas"},
		{property:"forcedColor", group:"lighting", label:"Cor Forçada", type:"color", default:"#009bde"},
		{property:"fpsLimit", group:"lighting", label:"Limite de FPS (Recomendado 28. Abaixe se a luz piscar ao digitar rápido)", type:"number", min:"15", max:"60", step:"1", default:"28"}
	];
}

const Keymap = {
	0: ["Esc", [0, 0]], 1: ["'", [0, 1]], 2: ["Tab", [0, 2]], 3: ["Caps Lock", [0, 3]], 4: ["Left Shift", [0, 4]], 5: ["Left Ctrl", [0, 5]], 6: ["Num Lock", [18, 1]],
	8: ["F1", [1, 0]], 9: ["1", [1, 1]], 10: ["Q", [1, 2]], 11: ["A", [1, 3]], 12: ["\\", [1, 4]], 13: ["Windows", [1, 5]], 14: ["Numpad /", [19, 1]],
	16: ["F2", [2, 0]], 17: ["2", [2, 1]], 18: ["W", [2, 2]], 19: ["S", [2, 3]], 20: ["Z", [2, 4]], 21: ["Left Alt", [2, 5]], 22: ["Numpad *", [20, 1]],
	24: ["F3", [3, 0]], 25: ["3", [3, 1]], 26: ["E", [3, 2]], 27: ["D", [3, 3]], 28: ["X", [3, 4]], 30: ["Numpad -", [21, 1]],
	32: ["F4", [4, 0]], 33: ["4", [4, 1]], 34: ["R", [4, 2]], 35: ["F", [4, 3]], 36: ["C", [4, 4]], 38: ["Numpad 7", [18, 2]],
	40: ["F5", [5, 0]], 41: ["5", [5, 1]], 42: ["T", [5, 2]], 43: ["G", [5, 3]], 44: ["V", [5, 4]], 45: ["Espaço", [6, 5]], 46: ["Numpad 8", [19, 2]],
	48: ["F6", [6, 0]], 49: ["6", [6, 1]], 50: ["Y", [6, 2]], 51: ["H", [6, 3]], 52: ["B", [6, 4]], 54: ["Numpad 9", [20, 2]],
	56: ["F7", [7, 0]], 57: ["7", [7, 1]], 58: ["U", [7, 2]], 59: ["J", [7, 3]], 60: ["N", [7, 4]], 62: ["Numpad 4", [18, 3]],
	64: ["F8", [8, 0]], 65: ["8", [8, 1]], 66: ["I", [8, 2]], 67: ["K", [8, 3]], 68: ["M", [8, 4]], 70: ["Numpad 5", [19, 3]],
	72: ["F9", [9, 0]], 73: ["9", [9, 1]], 74: ["O", [9, 2]], 75: ["L", [9, 3]], 76: [",", [9, 4]], 77: ["Right Alt", [9, 5]], 78: ["Numpad 6", [20, 3]],
	80: ["F10", [10, 0]], 81: ["0", [10, 1]], 82: ["P", [10, 2]], 83: ["Ç", [10, 3]], 84: [".", [10, 4]], 85: ["Fn", [10, 5]], 86: ["Numpad +", [21, 3]],
	88: ["F11", [11, 0]], 89: ["-", [11, 1]], 90: ["´", [11, 2]], 91: ["~", [11, 3]], 92: [";", [11, 4]], 93: ["Menu", [11, 5]], 94: ["Numpad 2", [19, 4]],
	96: ["F12", [12, 0]], 97: ["=", [12, 1]], 98: ["[", [12, 2]], 99: ["]", [12, 3]], 100: ["/", [12, 4]], 101: ["Right Ctrl", [12, 5]], 102: ["Numpad 3", [20, 4]],
	104: ["PrtSc", [15, 0]], 105: ["Backspace", [13, 1]], 107: ["Enter", [13, 3]], 108: ["Right Shift", [13, 4]], 109: ["Seta Esquerda", [15, 5]], 110: ["Numpad 0", [18, 5]],
	112: ["ScrLk", [16, 0]], 113: ["Insert", [15, 1]], 114: ["Delete", [15, 2]], 115: ["Page Up", [16, 1]], 116: ["Seta Cima", [16, 4]], 117: ["Seta Baixo", [16, 5]], 118: ["Numpad Del", [20, 5]],
	120: ["Pause", [17, 0]], 121: ["Home", [16, 2]], 122: ["End", [16, 3]], 123: ["Page Down", [17, 1]], 124: ["Numpad 1", [18, 4]], 125: ["Seta Direita", [17, 5]], 126: ["Numpad Enter", [21, 5]]
};

export function Initialize() {
	device.set_endpoint(1, 0x0092, 0xff1c, 0x0004);
	EVISION.Initialize();
	EVISION.setSoftwareMode();
}

export function Render() {
	EVISION.sendColors();
}

export function Shutdown() {
	EVISION.restoreHardwareMode();
}

class EVISION_Device_Protocol {
	constructor() {
		this.RGBData = new Array(392).fill(0);
		this.packetBuffer = new Array(64).fill(0);
		this.lastRenderTime = 0;

		// Arrays planos: eliminam property lookups em {idx, x, y} por frame
		this.ledCount = 0;
		this.RenderIdx = null; // índice no RGBData (pré-multiplicado por 3)
		this.RenderX   = null;
		this.RenderY   = null;

		// Cache do forcedColor para evitar regex por frame
		this._lastForcedColor = "";
		this._cachedForcedRgb = [0, 0, 0];

		// Bytes constantes do cabeçalho — escritos aqui uma vez só
		// packetBuffer[3], [4], [7] nunca mudam entre pacotes
		this.packetBuffer[3] = 0x12;
		this.packetBuffer[4] = 56;
		this.packetBuffer[7] = 0x00;
	}

	Initialize() {
		const LedNames     = [];
		const LedPositions = [];
		const ids          = Object.keys(Keymap);
		const count        = ids.length;

		this.RenderIdx = new Array(count);
		this.RenderX   = new Array(count);
		this.RenderY   = new Array(count);
		this.ledCount  = count;

		for (var i = 0; i < count; i++) {
			var id    = parseInt(ids[i]);
			var entry = Keymap[id];
			var x     = entry[1][0];
			var y     = entry[1][1];

			LedNames.push(entry[0]);
			LedPositions.push([x, y]);

			this.RenderIdx[i] = id * 3; // pré-multiplica: elimina id*3 por frame
			this.RenderX[i]   = x;
			this.RenderY[i]   = y;
		}

		device.setName("Redragon K557 Kala V2");
		device.setSize([22, 6]);
		device.setControllableLeds(LedNames, LedPositions);
	}

	setSoftwareMode() {
		try {
			device.write([0x04, 0x8c, 0x00, 0x0b, 0x30, 0x50, 0x01], 64);
			device.pause(30);
		} catch (e) {
			device.log("Erro ao iniciar modo software: " + e);
		}
	}

	// Inverso do setSoftwareMode: devolve o controle dos LEDs ao firmware do teclado.
	// Chamado por Shutdown() para evitar que o teclado fique preso em software mode
	// após reload do plugin, fechamento do SignalRGB ou troca de perfil.
	// NOTA: o byte final 0x00 (vs 0x01 no setSoftwareMode) é o padrão EVISION para
	// saída de software mode. Confirme o comportamento no primeiro teste:
	// os LEDs devem retornar ao efeito de hardware padrão do teclado ao desativar o plugin.
	restoreHardwareMode() {
		try {
			device.write([0x04, 0x8c, 0x00, 0x0b, 0x30, 0x50, 0x00], 64);
			device.pause(30);
		} catch (e) {
			device.log("Erro ao restaurar modo hardware: " + e);
		}
	}

	sendColors() {
		// Throttling: fpsLimit sempre definido após Initialize; || 28 como fallback seguro
		var targetDelay = 1000 / (fpsLimit || 28);
		var agora = Date.now();
		if (agora - this.lastRenderTime < targetDelay) {
			return;
		}
		this.lastRenderTime = agora;

		var RGBData   = this.RGBData;    // referência local evita this-lookup por LED
		var RenderIdx = this.RenderIdx;
		var RenderX   = this.RenderX;
		var RenderY   = this.RenderY;
		var len       = this.ledCount;   // evita .length no objeto por iteração
		var i, idx, color;

		if (LightingMode === "Forçado") {
			// Cache: só recalcula o hex→rgb quando a cor mudar na UI
			if (forcedColor !== this._lastForcedColor) {
				this._cachedForcedRgb = hexToRgb(forcedColor);
				this._lastForcedColor = forcedColor;
			}
			var fr = this._cachedForcedRgb[0];
			var fg = this._cachedForcedRgb[1];
			var fb = this._cachedForcedRgb[2];

			// Branch fora do loop: sem ternário por LED
			for (i = 0; i < len; i++) {
				idx = RenderIdx[i];
				RGBData[idx]     = fr;
				RGBData[idx + 1] = fg;
				RGBData[idx + 2] = fb;
			}
		} else {
			for (i = 0; i < len; i++) {
				idx   = RenderIdx[i];
				color = device.color(RenderX[i], RenderY[i]);
				RGBData[idx]     = color[0];
				RGBData[idx + 1] = color[1];
				RGBData[idx + 2] = color[2];
			}
		}

		this.writeRGBPackages();
	}

	writeRGBPackages() {
		var packetBuffer = this.packetBuffer; // referência local
		var RGBData      = this.RGBData;
		var i, j, start, sum, val;

		for (i = 0; i < 7; i++) {
			start = i * 56;
			sum   = 0;

			// Sem try/catch no hot path e sem || 0 (array já é numérico)
			for (j = 0; j < 56; j++) {
				val = RGBData[start + j];
				packetBuffer[8 + j] = val;
				sum += val;
			}

			val = sum + start + 74; // checksum: soma dos bytes + offset + constante do protocolo

			// [3], [4], [7] já estão corretos desde o construtor
			packetBuffer[0] = 0x04;
			packetBuffer[1] = val & 0xFF;
			packetBuffer[2] = (val >>> 8) & 0xFF;
			packetBuffer[5] = start & 0xFF;
			packetBuffer[6] = (start >>> 8) & 0xFF;

			device.write(packetBuffer, 64);
			device.pause(2);
		}

		device.pause(4);
	}
}

const EVISION = new EVISION_Device_Protocol();

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0];
}
