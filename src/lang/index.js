import { createI18n } from 'vue-i18n'
import en from './en-us'
import cn from './zh-cn'
import tw from './zh-tw'
import th from './th-th'
import vi from './vi-vn'
import fr from './fr-fr'
import es from './es-es'
import pt from './pt-pt'
import ru from './ru-ru'
import id from './id-id'
import tr from './tr-tr'
import fa from './fa-ir'
import ja from './ja-jp'
import ar from './ar-sa'
import ka from './ka-ge'
import uk from './uk-ua'
import az from './az-az'
import ko from './ko-kr'

export const LOCALE_OPTIONS = [
  { label: '简体中文', value: 'zh-CN' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: 'English', value: 'en-US' },
  { label: 'ไทย', value: 'th-TH' },
  { label: 'Tiếng Việt', value: 'vi-VN' },
  { label: 'Français', value: 'fr-FR' },
  { label: 'Español', value: 'es-ES' },
  { label: 'Português', value: 'pt-PT' },
  { label: 'Русский', value: 'ru-RU' },
  { label: 'Bahasa Indonesia', value: 'id-ID' },
  { label: 'Türkçe', value: 'tr-TR' },
  { label: 'فارسی', value: 'fa-IR' },
  { label: '日本語', value: 'ja-JP' },
  { label: 'العربية', value: 'ar-SA' },
  { label: 'ქართული', value: 'ka-GE' },
  { label: 'Українська', value: 'uk-UA' },
  { label: 'Azərbaycan dili', value: 'az-AZ' },
  { label: '한국어', value: 'ko-KR' }
]
const i18n = createI18n({
  locale: localStorage.getItem('locale-lang') || navigator.language || navigator.browserLanguage,
  fallbackLocale: 'zh-CN',
  legacy: false,
  allowComposition: true,
  messages: {
    'en-US': en,
    'zh-CN': cn,
    'zh-TW': tw,
    'th-TH': th,
    'vi-VN': vi,
    'fr-FR': fr,
    'es-ES': es,
    'pt-PT': pt,
    'ru-RU': ru,
    'id-ID': id,
    'tr-TR': tr,
    'fa-IR': fa,
    'ja-JP': ja,
    'ar-SA': ar,
    'ka-GE': ka,
    'uk-UA': uk,
    'az-AZ': az,
    'ko-KR': ko
  }
})
export default i18n