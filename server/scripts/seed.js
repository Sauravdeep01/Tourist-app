const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment variables dynamically
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('../models/User');
const Tour = require('../models/Tour');
const Settings = require('../models/Settings');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Seed connected to DB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Connection Error in Seeder: ${error.message}`);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  await connectDB();

  try {
    // 1. Seed Site Settings
    console.log('Seeding settings...');
    const defaultSettings = {
      phone: '+91-120-4135777',
      whatsapp: '+911204135777',
      wechatId: 'APPL_Travel',
      email: 'tours@astirpassage.com',
      address: {
        en: 'Astir Passage Pvt. Ltd., Patna, Bihar, India',
        zh: '印度比哈尔邦巴特那 Astir Passage 私人有限公司',
      },
    };

    // Upsert single settings document
    await Settings.deleteMany({});
    await Settings.create(defaultSettings);
    console.log('Settings seeded successfully!');

    // 2. Seed Admin & Owner Accounts
    console.log('Seeding staff accounts...');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const ownerEmail = process.env.OWNER_EMAIL;
    const ownerPassword = process.env.OWNER_PASSWORD;

    if (!adminEmail || !adminPassword || !ownerEmail || !ownerPassword) {
      throw new Error(
        'ADMIN_EMAIL, ADMIN_PASSWORD, OWNER_EMAIL, and OWNER_PASSWORD must all be set in server/.env before seeding — no default credentials are baked into the code.'
      );
    }

    // Seed Admin
    const adminExists = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);
      await User.create({
        name: 'Technical Admin',
        email: adminEmail.toLowerCase(),
        passwordHash,
        role: 'admin',
        active: true,
        emailVerified: true, // seeded accounts bypass the OTP flow
      });
      console.log(`Admin account created: ${adminEmail}`);
    } else {
      if (!adminExists.emailVerified) {
        adminExists.emailVerified = true;
        await adminExists.save();
        console.log('Admin account already exists — marked as verified (v1.5 migration).');
      } else {
        console.log('Admin account already exists, skipping.');
      }
    }

    // Seed Owner
    const ownerExists = await User.findOne({ email: ownerEmail.toLowerCase() });
    if (!ownerExists) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(ownerPassword, salt);
      await User.create({
        name: 'APPL Owner',
        email: ownerEmail.toLowerCase(),
        passwordHash,
        role: 'owner',
        active: true,
        emailVerified: true, // seeded accounts bypass the OTP flow
      });
      console.log(`Owner account created: ${ownerEmail}`);
    } else {
      if (!ownerExists.emailVerified) {
        ownerExists.emailVerified = true;
        await ownerExists.save();
        console.log('Owner account already exists — marked as verified (v1.5 migration).');
      } else {
        console.log('Owner account already exists, skipping.');
      }
    }


    // 3. Seed Tour Packages (Bilingual)
    console.log('Seeding tour packages...');

    const packageA = {
      slug: '11-day-buddhist-pilgrimage-journey',
      title: {
        en: '11-Day Buddhist Pilgrimage Journey',
        zh: '11天佛教圣地朝圣之旅',
      },
      subtitle: {
        en: 'A Journey of Wisdom, Compassion, and Enlightenment',
        zh: '智慧、慈悲与觉悟之旅',
      },
      overview: {
        en: 'An extensive group tour covering the sacred places where Lord Buddha lived and taught across India and Nepal. Designed exclusively for Chinese-speaking tourists.',
        zh: '一次广泛的团队旅行，涵盖了佛陀在印度和尼泊尔生活和传教的圣地。专为中文游客设计。',
      },
      days: 11,
      nights: 10,
      coverImage: 'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=600',
      images: [
        'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=600',
      ],
      validFrom: {
        en: 'Valid from October 2026',
        zh: '2026年10月起有效',
      },
      featured: true,
      active: true,
      priceFrom: 1285,
      hotelCategory: {
        en: '5-Star or Similar',
        zh: '五星级或同等级',
      },
      cityStays: [
        { city: { en: 'Delhi', zh: '德里' }, nights: 1 },
        { city: { en: 'Varanasi', zh: '瓦拉纳西' }, nights: 1 },
        { city: { en: 'Bodh Gaya', zh: '菩提伽耶' }, nights: 2 },
        { city: { en: 'Patna', zh: '巴特那' }, nights: 1 },
        { city: { en: 'Kushinagar', zh: '拘尸那伽' }, nights: 1 },
        { city: { en: 'Lumbini', zh: '蓝毗尼' }, nights: 1 },
        { city: { en: 'Shravasti', zh: '舍卫城' }, nights: 1 },
        { city: { en: 'Lucknow', zh: '勒克瑙' }, nights: 1 },
        { city: { en: 'Agra', zh: '阿格拉' }, nights: 1 },
      ],
      itinerary: [
        {
          day: 1,
          title: { en: 'Shanghai → Delhi', zh: '上海 → 德里' },
          accommodationCity: { en: 'Delhi', zh: '德里' },
          meals: { en: 'Welcome dinner', zh: '欢迎晚餐' },
          activities: [
            {
              category: { en: 'Flight', zh: '航班' },
              description: { en: 'Flight MU563 Shanghai (PVG) to Delhi (DEL) 12:50 - 17:45', zh: '乘坐东方航空 MU563 航班从上海浦东 (PVG) 飞往德里 (DEL) 12:50 - 17:45' }
            },
            {
              category: { en: 'Dinner', zh: '晚餐' },
              description: { en: 'Check-in and enjoy a warm welcome dinner.', zh: '入住并享用温馨的欢迎晚餐。' }
            }
          ]
        },
        {
          day: 2,
          title: { en: 'Delhi → Varanasi (flight) → Sarnath', zh: '德里 → 瓦拉纳西 (航班) → 鹿野苑' },
          accommodationCity: { en: 'Varanasi', zh: '瓦拉纳西' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Sermon Site', zh: '说法地' },
              description: { en: 'Visit Dhamek Stupa, Chinese Temple, Five Disciples\' Stupa, and the Archaeological Museum in Sarnath.', zh: '参观鹿野苑的答枚克佛塔、中华大觉寺、五比丘迎佛塔和考古博物馆。' }
            },
            {
              category: { en: 'Worship', zh: '恒河晚祷' },
              description: { en: 'Attend the mystical evening Ganga Aarti ceremony in Varanasi.', zh: '在瓦拉纳西参加神秘的恒河晚祷仪式。' }
            }
          ]
        },
        {
          day: 3,
          title: { en: 'Varanasi → Bodh Gaya', zh: '瓦拉纳西 → 菩提伽耶' },
          accommodationCity: { en: 'Bodh Gaya', zh: '菩提伽耶' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'River Boat', zh: '恒河游船' },
              description: { en: 'Sunrise Ganges boat ride to witness morning rituals.', zh: '乘船游览恒河日出，见证晨间仪式。' }
            },
            {
              category: { en: 'Sightseeing & Drive', zh: '观光与行车' },
              description: { en: 'Visit Bharat Mata & Durga temples; then drive to Bodh Gaya.', zh: '参观中华寺和杜尔迦庙；之后驱车前往菩提伽耶。' }
            }
          ]
        },
        {
          day: 4,
          title: { en: 'Bodh Gaya — Path to Enlightenment', zh: '菩提伽耶 — 悟道之路' },
          accommodationCity: { en: 'Bodh Gaya', zh: '菩提伽耶' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Temples', zh: '寺庙' },
              description: { en: 'Visit the world-famous Mahabodhi Temple and the Great Buddha Statue.', zh: '参观世界闻名的摩诃菩提寺和大佛像。' }
            },
            {
              category: { en: 'Holy Sites', zh: '神圣遗址' },
              description: { en: 'Excursion to Pragbodhi Hill, Uruvela Forest, and Sujata Village; visit international monasteries.', zh: '游览留鸡足山（前正觉山）、优楼频螺兵营遗址和牧女苏嘉塔村，参观各国寺院（泰、缅、斯、日以及汉藏）。' }
            }
          ]
        },
        {
          day: 5,
          title: { en: 'Bodh Gaya → Rajgir → Nalanda → Patna', zh: '菩提伽耶 → 王舍城 → 那烂陀 → 巴特那' },
          accommodationCity: { en: 'Patna', zh: '巴特那' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Peak & Ruins', zh: '灵鹫山与遗址' },
              description: { en: 'Climb Vulture Peak; explore Nalanda University ruins, and proceed to Patna.', zh: '登上灵鹫山；探索那烂陀大学遗址，然后前往巴特那。' }
            }
          ]
        },
        {
          day: 6,
          title: { en: 'Patna → Vaishali → Kushinagar', zh: '巴特那 → 吠舍离 → 拘尸那伽' },
          accommodationCity: { en: 'Kushinagar', zh: '拘尸那伽' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Pillars & Stupas', zh: '石柱与佛塔' },
              description: { en: 'Visit Ashokan Pillar, Relic Stupa, Ananda Stupa, and Monkey Pond in Vaishali.', zh: '在吠舍离参观阿育王石柱、佛陀舍利塔、阿难陀塔和猕猴献蜜池。' }
            },
            {
              category: { en: 'Nirvana', zh: '涅槃圣地' },
              description: { en: 'Explore Reclining Buddha, Mahaparinirvana Stupa, and Shuanglin Temple.', zh: '参观大涅槃寺的卧佛造像、涅槃塔和双林寺。' }
            }
          ]
        },
        {
          day: 7,
          title: { en: 'Kushinagar → Lumbini (Nepal)', zh: '拘尸那伽 → 蓝毗尼 (尼泊尔)' },
          accommodationCity: { en: 'Lumbini', zh: '蓝毗尼' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Border Crossing', zh: '过境' },
              description: { en: 'Cross border into Nepal; visit Lumbini Garden and Maya Devi Temple.', zh: '过境进入尼泊尔；游览蓝毗尼花园和摩耶夫人庙。' }
            },
            {
              category: { en: 'Monastery', zh: '寺院' },
              description: { en: 'Visit the Ashokan Pillar and Chinese Monastery.', zh: '参观阿育王石柱和中华寺。' }
            }
          ]
        },
        {
          day: 8,
          title: { en: 'Lumbini → Shravasti', zh: '蓝毗尼 → 舍卫城' },
          accommodationCity: { en: 'Shravasti', zh: '舍卫城' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Gardens', zh: '祇树给孤独园' },
              description: { en: 'Visit Jetavana Monastery (Amitabha Sutra preaching site) and the sacred Ananda Bodhi Tree.', zh: '游览祇陀林（阿弥陀经讲经地）和神圣的阿难菩提树。' }
            }
          ]
        },
        {
          day: 9,
          title: { en: 'Shravasti → Lucknow', zh: '舍卫城 → 勒克瑙' },
          accommodationCity: { en: 'Lucknow', zh: '勒克瑙' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Drive', zh: '车程' },
              description: { en: 'Drive via Setavya "Buddha Airport" to Lucknow, capital of Uttar Pradesh.', zh: '途径舍多波耶“佛陀机场”驱车前往北方邦首府勒克瑙。' }
            }
          ]
        },
        {
          day: 10,
          title: { en: 'Lucknow → Sankasya → Agra', zh: '勒克瑙 → 桑迦施 → 阿格拉' },
          accommodationCity: { en: 'Agra', zh: '阿格拉' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Descent Place', zh: '降凡处' },
              description: { en: 'Visit Sankasya, where Buddha descended from Tavatimsa Heaven; see Elephant Capital Pillar.', zh: '参观桑迦施（佛陀自天宫降凡处），瞻仰阿育王象头石柱。' },
            },
            {
              category: { en: 'Drive', zh: '行车' },
              description: { en: 'Proceed to Agra, city of Taj Mahal.', zh: '之后前往阿格拉（泰姬陵之城）。' }
            }
          ]
        },
        {
          day: 11,
          title: { en: 'Agra → Delhi → Shanghai', zh: '阿格拉 → 德里 → 上海' },
          accommodationCity: { en: 'On Board', zh: '机上' },
          meals: { en: 'Breakfast, Lunch, Farewell Dinner', zh: '早餐、午餐、告别晚餐' },
          activities: [
            {
              category: { en: 'Wonders', zh: '世界奇观' },
              description: { en: 'Visit Taj Mahal and Agra Fort; farewell dinner in Delhi.', zh: '参观世界著名的泰姬陵和阿格拉古堡；在德里享用告别晚餐。' }
            },
            {
              category: { en: 'Flight', zh: '航班' },
              description: { en: 'Depart via flight MU564 Delhi to Shanghai 19:55 - 04:10 (+1).', zh: '乘坐 MU564 航班从德里返回上海 19:55 - 04:10 (+1)。' }
            }
          ]
        }
      ],
      pricing: [
        { label: { en: 'Minimum group size', zh: '最低成团人数' }, amount: { en: '12 paying passengers', zh: '12 位付费旅客' } },
        { label: { en: 'Cost per person (twin sharing)', zh: '每人费用（双人共住）' }, amount: { en: 'US$ 1,285', zh: '1,285 美元' } },
        { label: { en: 'Single room supplement', zh: '单人间附加费' }, amount: { en: 'US$ 705', zh: '705 美元' } }
      ],
      supplements: [
        { label: { en: 'Domestic airfare supplement (Varanasi–Delhi)', zh: '国内机票附加费（瓦拉纳西-德里）' }, amount: { en: 'US$ 90', zh: '90 美元' } },
        { label: { en: 'Tipping (12-pax group)', zh: '小费（12人团队）' }, amount: { en: 'US$ 6 per person per day', zh: '每人每天 6 美元' } }
      ],
      includes: [
        { item: { en: 'Accommodation', zh: '住宿' }, details: { en: '10 nights twin-sharing accommodation', zh: '10 晚双人合住' } },
        { item: { en: 'Meals', zh: '餐饮' }, details: { en: 'All meals (10 Breakfasts / 10 Lunches / 11 Dinners)', zh: '行程内所有餐食（10早/10午/11晚）' } },
        { item: { en: 'Transport', zh: '交通' }, details: { en: 'All transfers & sightseeing by private air-conditioned coach', zh: '全程私人空调大巴接送与观光' } },
        { item: { en: 'Guide', zh: '导游' }, details: { en: 'Chinese-speaking professional guide from arrival to departure', zh: '全程中文专业导游陪同' } },
        { item: { en: 'Others', zh: '其他' }, details: { en: 'Monument entrance fees, driver allowance, tolls, taxes, 1 bottle of water/person/day', zh: '景点门票、司机津贴、路桥费、税费、每人每天1瓶矿泉水' } }
      ],
      excludes: [
        { item: { en: 'Airfares', zh: '机票' }, details: { en: 'International and domestic airfares (except Varanasi-Delhi supplement)', zh: '国际和国内大交通机票（除瓦拉纳西-德里机票附加费外）' } },
        { item: { en: 'Tips', zh: '小费' }, details: { en: 'Tips to drivers, local guides', zh: '给司机、导游的小费' } },
        { item: { en: 'Personal Expenses', zh: '个人消费' }, details: { en: 'Laundry, soft drinks, international telephone calls, etc.', zh: '洗衣、饮料、国际电话等个人费用' } }
      ],
      notes: [
        { en: 'Prices are indicative and subject to availability at booking.', zh: '此价格仅供参考，最终价格以实际预订时车况为准。' }
      ]
    };

    const packageB = {
      slug: '13-day-buddhist-circuit-india',
      title: {
        en: '13-Day Buddhist Circuit, India',
        zh: '印度佛教圣地13天行程报价',
      },
      subtitle: {
        en: 'Extended Spiritual Journey Across Northern India',
        zh: '北印度神圣灵修深度之旅',
      },
      overview: {
        en: 'An extended spiritual circuit covering key Buddhist sites across India with 12 nights stay by city.',
        zh: '涵盖印度主要佛教圣地的深度朝圣之旅，按城市安排12晚住宿。',
      },
      days: 13,
      nights: 12,
      coverImage: 'https://images.unsplash.com/photo-1545124445-53a55e756f4d?q=80&w=800',
      images: [
        'https://images.unsplash.com/photo-1545124445-53a55e756f4d?q=80&w=800',
        'https://images.unsplash.com/photo-1625316708582-7c38734be31d?q=80&w=800',
        'https://images.unsplash.com/photo-1608958416738-42289635fc9d?q=80&w=800',
        'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=800',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800',
        'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=800',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800',
      ],
      validFrom: {
        en: 'Valid from October 2026',
        zh: '2026年10月起有效',
      },
      featured: false,
      active: true,
      priceFrom: 941,
      cityStays: [
        { city: { en: 'Delhi', zh: '德里' }, nights: 2 },
        { city: { en: 'Varanasi', zh: '瓦拉纳西' }, nights: 1 },
        { city: { en: 'Bodhgaya', zh: '菩提伽耶' }, nights: 2 },
        { city: { en: 'Rajgir', zh: '王舍城' }, nights: 1 },
        { city: { en: 'Vaishali', zh: '吠舍离' }, nights: 1 },
        { city: { en: 'Kushinagar', zh: '拘尸那伽' }, nights: 1 },
        { city: { en: 'Sravasti', zh: '舍卫城' }, nights: 1 },
        { city: { en: 'Lucknow', zh: '勒克瑙' }, nights: 1 },
        { city: { en: 'Agra', zh: '阿格拉' }, nights: 1 },
      ],
      itinerary: [
        {
          day: 1,
          title: { en: 'Arrival in Delhi', zh: '抵达德里' },
          accommodationCity: { en: 'Delhi', zh: '德里' },
          meals: { en: 'Dinner', zh: '晚餐' },
          activities: [
            {
              category: { en: 'Arrival', zh: '到达' },
              description: { en: 'Welcome to India! Pick up from airport and transfer to city.', zh: '欢迎来到印度！机场接机并送往休息。' }
            }
          ]
        },
        {
          day: 2,
          title: { en: 'Delhi Sightseeing', zh: '德里市区游览' },
          accommodationCity: { en: 'Delhi', zh: '德里' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'City Tour', zh: '城市游览' },
              description: { en: 'Visit historic Red Fort, Qutub Minar, and Lotus Temple.', zh: '游览历史悠久的红堡、顾特卜塔和莲花庙。' }
            }
          ]
        },
        {
          day: 3,
          title: { en: 'Delhi → Varanasi (flight) → Sarnath', zh: '德里 → 瓦拉纳西 (飞) → 鹿野苑' },
          accommodationCity: { en: 'Varanasi', zh: '瓦拉纳西' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Holy Site', zh: '圣地' },
              description: { en: 'Fly to Varanasi. Excursion to Sarnath where Buddha gave his first sermon.', zh: '飞往瓦拉纳西。前往鹿野苑，这是佛陀初转法轮之地。' }
            }
          ]
        },
        {
          day: 4,
          title: { en: 'Varanasi → Bodh Gaya', zh: '瓦拉纳西 → 菩提伽耶' },
          accommodationCity: { en: 'Bodh Gaya', zh: '菩提伽耶' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Boat', zh: '游船' },
              description: { en: 'Morning boat ride on Ganges; drive to Bodh Gaya.', zh: '清晨乘船游览恒河；乘车前往菩提伽耶。' }
            }
          ]
        },
        {
          day: 5,
          title: { en: 'Bodh Gaya Enlightenment Tour', zh: '菩提伽耶成道游览' },
          accommodationCity: { en: 'Bodh Gaya', zh: '菩提伽耶' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Enlightenment', zh: '成道' },
              description: { en: 'Full day at Mahabodhi temple and the Bodhi tree.', zh: '全天在摩诃菩提寺与菩提树下修持，朝礼佛陀成道圣迹。' }
            }
          ]
        },
        {
          day: 6,
          title: { en: 'Bodh Gaya → Rajgir', zh: '菩提伽耶 → 王舍城' },
          accommodationCity: { en: 'Rajgir', zh: '王舍城' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Mountain', zh: '灵鹫山' },
              description: { en: 'Visit Gridhrakuta (Vulture Peak), Bimbsara Jail and Hot Springs.', zh: '参观灵鹫山、频婆娑罗王监狱和温泉。' }
            }
          ]
        },
        {
          day: 7,
          title: { en: 'Rajgir → Nalanda → Vaishali', zh: '王舍城 → 那烂陀 → 吠舍离' },
          accommodationCity: { en: 'Vaishali', zh: '吠舍离' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Ruins', zh: '遗址' },
              description: { en: 'Tour the ancient Nalanda University; drive to Vaishali.', zh: '参观古代那烂陀大学遗址；乘车前往吠舍离。' }
            }
          ]
        },
        {
          day: 8,
          title: { en: 'Vaishali → Kushinagar', zh: '吠舍离 → 拘尸那伽' },
          accommodationCity: { en: 'Kushinagar', zh: '拘尸那伽' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Nirvana', zh: '涅槃' },
              description: { en: 'Visit where Buddha entered Mahaparinirvana.', zh: '朝礼佛陀大般涅槃处，参拜大涅槃双林寺和涅槃塔。' }
            }
          ]
        },
        {
          day: 9,
          title: { en: 'Kushinagar → Shravasti', zh: '拘尸那伽 → 舍卫城' },
          accommodationCity: { en: 'Shravasti', zh: '舍卫城' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Monastery', zh: '给孤独园' },
              description: { en: 'Drive to Shravasti; visit Jetavana Gardens.', zh: '前往舍卫城；参观佛陀长年讲经说法之给孤独园。' }
            }
          ]
        },
        {
          day: 10,
          title: { en: 'Shravasti → Lucknow', zh: '舍卫城 → 勒克瑙' },
          accommodationCity: { en: 'Lucknow', zh: '勒克瑙' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Travel', zh: '行程' },
              description: { en: 'Drive to Lucknow, capital of Uttar Pradesh.', zh: '乘车前往北方邦省会勒克瑙。' }
            }
          ]
        },
        {
          day: 11,
          title: { en: 'Lucknow → Agra', zh: '勒克瑙 → 阿格拉' },
          accommodationCity: { en: 'Agra', zh: '阿格拉' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Drive', zh: '行车' },
              description: { en: 'Drive to Agra; evening at leisure.', zh: '乘车前往阿格拉；傍晚自由活动。' }
            }
          ]
        },
        {
          day: 12,
          title: { en: 'Agra (Taj Mahal) → Delhi', zh: '阿格拉 (泰姬陵) → 德里' },
          accommodationCity: { en: 'Delhi', zh: '德里' },
          meals: { en: 'Breakfast, Lunch, Dinner', zh: '早餐、午餐、晚餐' },
          activities: [
            {
              category: { en: 'Wonders', zh: '奇观' },
              description: { en: 'Sunrise at Taj Mahal, Agra Fort visit; drive to Delhi.', zh: '日出时分参观泰姬陵，随后游览阿格拉古堡；乘车返回德里。' }
            }
          ]
        },
        {
          day: 13,
          title: { en: 'Delhi Departure', zh: '德里离境' },
          accommodationCity: { en: 'On Board', zh: '机上' },
          meals: { en: 'Breakfast', zh: '早餐' },
          activities: [
            {
              category: { en: 'Departure', zh: '送机' },
              description: { en: 'Transfer to Delhi airport for flight back home.', zh: '送往德里机场，搭乘班机回国，结束殊胜的朝圣之旅。' }
            }
          ]
        }
      ],
      pricing: [
        { label: { en: '15 + 01 Pax paying', zh: '15 + 01 付费人数' }, amount: { en: 'USD 1032 Per person', zh: 'USD 1032 每人' } },
        { label: { en: '20 + 01 Pax paying', zh: '20 + 01 付费人数' }, amount: { en: 'USD 975 Per person', zh: 'USD 975 每人' } },
        { label: { en: '25 + 01 Pax paying', zh: '25 + 01 付费人数' }, amount: { en: 'USD 941 Per person', zh: 'USD 941 每人' } },
        { label: { en: 'Single Room Supplement', zh: '单人间附加费' }, amount: { en: 'USD 652 Per single room', zh: 'USD 652 每间' } }
      ],
      supplements: [
        { label: { en: 'Delhi - Varanasi flight supplement', zh: '德里－瓦拉纳西航班附加费' }, amount: { en: 'USD 100 PP (EXTRA)', zh: '每人100美元（额外收费）' } },
        { label: { en: 'Guide Airfare Supplement', zh: '导游机票附加费' }, amount: { en: 'USD 100 (EXTRA)', zh: '100美元（额外收费）' } }
      ],
      includes: [
        { item: { en: 'Accommodation', zh: '双人间住宿' }, details: { en: 'Accommodation on Twin sharing basis as per itinerary', zh: '按行程安排双人间住宿' } },
        { item: { en: 'Transport', zh: '空调大巴交通' }, details: { en: 'Transport using A/C Large coach 41 Seater as per itinerary', zh: '按行程提供41座空调大巴交通' } },
        { item: { en: 'Meals', zh: '餐饮安排' }, details: { en: 'Meals as per the itinerary', zh: '按行程安排餐饮' } },
        { item: { en: 'Guide', zh: '中文导游' }, details: { en: '01 Chinese speaking guide as per itinerary', zh: '按行程配备1名中文导游' } },
        { item: { en: 'Mineral Water', zh: '矿泉水' }, details: { en: '02 bottle of mineral water per day per person', zh: '每人每天提供2瓶矿泉水' } },
        { item: { en: 'Monuments', zh: '景点门票' }, details: { en: 'Monuments as per the itinerary. Single entry only.', zh: '按行程参观景点，仅含单次门票' } }
      ],
      excludes: [
        { item: { en: 'Personal Expenses', zh: '个人费用' }, details: { en: 'Any personal expenses', zh: '任何个人费用' } },
        { item: { en: 'Tips', zh: '小费' }, details: { en: 'Tips for guide and driver', zh: '导游及司机小费' } },
        { item: { en: 'Optional Tours', zh: '自选项目' }, details: { en: 'Any optional tours', zh: '任何自选观光项目' } },
        { item: { en: 'Insurance', zh: '旅游保险' }, details: { en: 'Travel insurance', zh: '旅游保险' } },
        { item: { en: 'Airfare', zh: '机票' }, details: { en: 'International / domestic airfare (unless stated)', zh: '国际/国内机票（除非特别说明）' } },
        { item: { en: 'Visa Fees', zh: '签证费' }, details: { en: 'Visa fees', zh: '签证费' } },
        { item: { en: 'Unmentioned Items', zh: '其他未含' }, details: { en: 'Anything not mentioned in the inclusion list', zh: '一切未在包含项目中列明的费用' } }
      ],
      notes: [
        { en: 'Airfare is Subject to Change at the time of booking, NO FOC on Airfares.', zh: '机票价格以预订时为准，机票不含免费名额。' },
        { en: 'The baggage policy for flight will be 15 kg Check-in Baggage + 07 Hand Baggage.', zh: '航班行李政策：15公斤托运行李 + 7公斤手提行李。' },
        { en: 'Rooms are subject to availability at the time of final confirmation.', zh: '客房以最终确认时的空房情况为准。' }
      ]
    };

    // Upsert Packages
    console.log('Upserting Package A...');
    await Tour.findOneAndUpdate(
      { slug: packageA.slug },
      { $set: packageA },
      { upsert: true, new: true }
    );

    console.log('Upserting Package B...');
    await Tour.findOneAndUpdate(
      { slug: packageB.slug },
      { $set: packageB },
      { upsert: true, new: true }
    );

    console.log('Tour packages seeded successfully!');
  } catch (err) {
    console.error(`Database seeding failed: ${err.message}`);
  } finally {
    mongoose.connection.close();
    console.log('Seed database connection closed.');
  }
};

seedDatabase();
