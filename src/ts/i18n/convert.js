import en_us from "./en_us.yaml";
import format from "string-format";
const locales = {
	en_us: en_us
};

export const __ = (locale, t) => {
	if (locale in locales) {
		if (t.id in locale) {
			return format(locales[locale][t.id], ...t.params);
		} else {
			return format("[{0}] not found in locale [{1}]", t.id, locale);
		}
	} else {
		return format("[{0}] not found in list of locales", locale);
	}
};
