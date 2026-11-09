import type { Handler } from "../Route.ts";

export const slicer = (path: string) => {
  const SPECIAL_SYMBOL = /[^A-Za-z0-9\/:]/g;
  const regexSegments = [];
  const paramNames = [];

  const escapeRegExp = (stockPath: string) => {
    return stockPath.replace(SPECIAL_SYMBOL, (match: string) => {
      return "\\" + match;
    });
  }; // * Поиск спец-символов, и добавление слэша для заземления

  const segments = escapeRegExp(path).split("/"); // * Нарезание пути по /

  for (const segment of segments) {
    if (segment.startsWith(":")) {
      const replaceColon = segment.slice(1);
      paramNames.push(replaceColon); // * пушинг атрибутов у которых было : перед ними
      regexSegments.push("([^/]+)"); // * замена атрибута : на данную регулярку
    } else {
      regexSegments.push(segment); // * просто возращение ключевых слов типо users или todos
    }
  }

  const regexSlashFilters = regexSegments.filter((item) => item); // * Фильтрация от пустых строк "" так как filter
  // * возвращает boolean, и в данном случае "" это false, поэтому нам это не нужно.

  const regexFinal = "^/" + regexSlashFilters.join("/") + "$"; // * склеивание регулярки

  return {
    regex: new RegExp(regexFinal),
    paramNames,
  };
};
