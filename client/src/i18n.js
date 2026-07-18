import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  zh: {
    translation: {
      navbar: {
        home: '首页',
        tours: '佛旅路线',
        about: '关于我们',
        contact: '联系我们',
        login: '登录',
        signup: '注册',
        logout: '退出登录',
        myAccount: '我的账户',
      },
      hero: {
        title: '追寻佛陀的足迹',
        pitch: '印度与尼泊尔专业佛陀成道圣地朝圣团队，专为华语朝圣者打造。',
        exploreBtn: '浏览佛旅路线',
        planBtn: '规划我的朝圣',
      },
      featured: {
        title: '精选朝野路线',
        subtitle: '开启您的心灵净化之旅，亲临佛陀圣迹。',
        mostPopular: '最受欢迎',
        days: '天',
        nights: '晚',
        priceFrom: '起',
        priceOnRequest: '价格面议',
        disclaimer: '价格仅供参考，最终报价以咨询为准。',
        viewDetails: '查看详情',
      },
      whyUs: {
        title: '为什么选择我们',
        guideTitle: '专业中文导游',
        guideDesc: '深入了解佛教历史的资深导游，提供全程中文讲解与随同随行。',
        hotelTitle: '高品质星级酒店',
        hotelDesc: '精选五星级或同等高档酒店，保障您在朝圣途中的舒适休息。',
        mealTitle: '全程餐饮保障',
        mealDesc: '提供符合华人饮食习惯的干净、美味膳食，满足朝圣途中的营养需求。',
        transportTitle: '豪华空调大巴',
        transportDesc: '全程使用安全舒适的私人豪华空调巴士，确保城际交通无忧。',
      },
      sacredSites: {
        title: '佛教圣八大圣迹与遗址',
        subtitle: '追寻佛陀从诞生到大般涅槃的一生足迹。',
        bodhgaya: '菩提伽耶 (悟道之地)',
        sarnath: '鹿野苑 (初转法轮)',
        lumbini: '蓝毗尼 (佛陀诞生)',
        kushinagar: '拘尸那伽 (般涅槃地)',
        nalanda: '那烂陀 (佛教大学)',
        rajgir: '王舍城 (灵鹫讲经)',
        shravasti: '舍卫城 (给孤独园)',
        agra: '阿格拉 (泰姬陵)',
      },
      cta: {
        title: '准备好开启您的圣迹之旅了吗？',
        desc: '立即联系我们，获取针对您的团队人数与出行日期的专属报价。',
        contactBtn: '获取报价',
        signupPrompt: '注册后联系我们',
      },
      footer: {
        tagline: '智慧、慈悲与觉悟之旅',
        address: '地址',
        phone: '电话',
        whatsapp: 'WhatsApp',
        wechat: '微信 ID',
        email: '邮箱',
        copyright: '© 2026 APPL Travel. 保留所有权利。',
      }
    }
  },
  en: {
    translation: {
      navbar: {
        home: 'Home',
        tours: 'Tours',
        about: 'About',
        contact: 'Contact',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Log Out',
        myAccount: 'My Account',
      },
      hero: {
        title: 'Walk in the Footsteps of the Buddha',
        pitch: 'Professional group pilgrimage tours across India and Nepal, custom-tailored for Chinese-speaking pilgrims.',
        exploreBtn: 'Explore Tours',
        planBtn: 'Plan My Pilgrimage',
      },
      featured: {
        title: 'Featured Pilgrimage Journeys',
        subtitle: 'Embark on a spiritual journey to the sacred sites of Buddhism.',
        mostPopular: 'Most Popular',
        days: 'Days',
        nights: 'Nights',
        priceFrom: 'From',
        priceOnRequest: 'Price on request',
        disclaimer: 'Prices are indicative and vary by season, group size, and current hotel/transport rates. Final quote provided on inquiry.',
        viewDetails: 'View Details',
      },
      whyUs: {
        title: 'Why Travel With Us',
        guideTitle: 'Chinese-Speaking Guide',
        guideDesc: 'Experienced guides deep in Buddhist history, offering explanations in Chinese throughout the tour.',
        hotelTitle: 'Quality Hotels',
        hotelDesc: 'Carefully selected 5-star or premium hotels to ensure comfortable rest during your pilgrimage.',
        mealTitle: 'All Meals Included',
        mealDesc: 'Hygienic, delicious meals tailored to Chinese culinary preferences and dietary needs.',
        transportTitle: 'Comfortable A/C Transport',
        transportDesc: 'Safe and comfortable private air-conditioned coach travel between cities.',
      },
      sacredSites: {
        title: 'Sacred Buddhist Sites & Landmarks',
        subtitle: 'Follow the life path of the Buddha from birth to Mahaparinirvana.',
        bodhgaya: 'Bodh Gaya (Enlightenment)',
        sarnath: 'Sarnath (First Sermon)',
        lumbini: 'Lumbini (Birthplace)',
        kushinagar: 'Kushinagar (Mahaparinirvana)',
        nalanda: 'Nalanda (Monastery ruins)',
        rajgir: 'Rajgir (Vulture Peak)',
        shravasti: 'Shravasti (Jetavana Garden)',
        agra: 'Agra (Taj Mahal)',
      },
      cta: {
        title: 'Ready to Begin Your Sacred Journey?',
        desc: 'Contact us today for a personalized quotation tailored to your group size and travel date.',
        contactBtn: 'Request a Quote',
        signupPrompt: 'Sign up to contact us',
      },
      footer: {
        tagline: 'A Journey of Wisdom, Compassion, and Enlightenment',
        address: 'Address',
        phone: 'Phone',
        whatsapp: 'WhatsApp',
        wechat: 'WeChat ID',
        email: 'Email',
        copyright: '© 2026 APPL Travel. All rights reserved.',
      }
    }
  }
};

// Retrieve language preference or default to Chinese
const savedLanguage = localStorage.getItem('lng') || 'zh';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false, // react already safes from xss
    }
  });

export default i18n;
