import en_us from "./en_us.yaml";
import format from "string-format";

// TODO: Localization (not during a game jame)
export const __ = t => {
	if (t == null) {
		return "";
	}
	if (typeof t === "string" && t in en_us) {
		return en_us[t];
	} else if (typeof t !== "string" && t.id in en_us) {
		return format(en_us[t.id], ...t.params);
	} else {
		return t.id != null ? t.id : t;
	}
};
