const db = require('../config/database');

const sampleBikes = [
  {
    name: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    price: 195000,
    fuelType: 'Petrol',
    specs: JSON.stringify({
      engine: '349cc Single Cylinder',
      power: '20.2 bhp @ 6100 rpm',
      torque: '27 Nm @ 4000 rpm',
      mileage: '35-40 kmpl',
      fuelCapacity: '13 liters',
      weight: '195 kg',
      topSpeed: '104 kmph',
      transmission: '5-speed manual',
      brakes: 'Disc front, Drum rear',
      wheelbase: '1370 mm'
    }),
    image: 'https://www.royalenfield.com/content/dam/royal-enfield/motorcycles/new-classic-350/studio-shots/new-360/emerald/01.png'
  },
  {
    name: 'Honda Activa 6G',
    brand: 'Honda',
    price: 75000,
    fuelType: 'Petrol',
    specs: JSON.stringify({
      engine: '109.51cc Single Cylinder',
      power: '7.68 bhp @ 8000 rpm',
      torque: '8.79 Nm @ 6500 rpm',
      mileage: '60 kmpl',
      fuelCapacity: '5.3 liters',
      weight: '107 kg',
      topSpeed: '83 kmph',
      transmission: 'CVT Automatic',
      brakes: 'Drum front and rear',
      wheelbase: '1238 mm'
    }),
     image: 'https://media.zigcdn.com/media/model/2022/Jul/right-side-view-725384691_930x620.jpg'
  },
  {
    name: 'Ather 450X',
    brand: 'Ather',
    price: 145000,
    fuelType: 'Electric',
    specs: JSON.stringify({
      motor: 'PMSM Motor',
      power: '6.2 kW (8.58 bhp)',
      torque: '26 Nm',
      range: '146 km (Eco mode)',
      battery: '3.7 kWh Lithium-ion',
      chargingTime: '5.4 hours (0-100%)',
      topSpeed: '90 kmph',
      weight: '108 kg',
      brakes: 'Disc front and rear',
      features: 'Touchscreen, Navigation, OTA updates'
    }),
    image: 'https://images.hindustantimes.com/auto/img/2022/07/19/1600x900/Ather_450X_(3)_1658225863348_1658227804008_1658227804008.jpeg'
  },
  {
    name: 'KTM Duke 350',
    brand: 'KTM',
    price: 295000,
    fuelType: 'Petrol',
    specs: JSON.stringify({
      engine: '373.2cc Single Cylinder',
      power: '43.5 bhp @ 9000 rpm',
      torque: '37 Nm @ 7000 rpm',
      mileage: '25-30 kmpl',
      fuelCapacity: '13.4 liters',
      weight: '167 kg',
      topSpeed: '167 kmph',
      transmission: '6-speed manual',
      brakes: 'Disc front and rear with ABS',
      wheelbase: '1357 mm'
    }),
    image: 'https://cdn.idntimes.com/content-images/post/20210628/ktm-duke-350-b96b82a90b51ce91e09592b8515c0dfa.png'
  },
  {
    name: 'TVS iQube Electric',
    brand: 'TVS',
    price: 115000,
    fuelType: 'Electric',
    specs: JSON.stringify({
      motor: 'Hub Motor',
      power: '4.4 kW',
      torque: '140 Nm',
      range: '100 km',
      battery: '3.04 kWh Lithium-ion',
      topSpeed: '78 kmph',
      weight: '118 kg',
      brakes: 'Disc front, Drum rear',
      features: 'Smart connectivity, Navigation'
    }),
    image: 'https://media.zigcdn.com/media/model/2022/Jul/front-right-view-763739214_930x620.jpg'
  },
  {
    name: 'Yamaha MT-15',
    brand: 'Yamaha',
    price: 165000,
    fuelType: 'Petrol',
    specs: JSON.stringify({
      engine: '155cc Single Cylinder',
      power: '18.4 bhp @ 10000 rpm',
      torque: '14.1 Nm @ 8500 rpm',
      mileage: '45-50 kmpl',
      fuelCapacity: '10 liters',
      weight: '139 kg',
      topSpeed: '131 kmph',
      transmission: '6-speed manual',
      brakes: 'Disc front and rear with ABS',
      wheelbase: '1335 mm'
    }),
    image: 'https://images.ctfassets.net/8zlbnewncp6f/5YTtgv83QvEntnWShVIPJw/9b79ab8e9693eec35c43a7fa3a052d3a/Yamaha_MT_15_2024_Imagen_principal.jpg'
  }
];

const sampleShowrooms = [
  {
    name: 'Metro Motors Hub',
    location: 'Mumbai',
    brands: JSON.stringify(['Honda', 'TVS', 'Yamaha']),
    phone: '+91 98765 43210',
    address: 'Shop No. 15-16, Ground Floor, Metro Mall, Andheri West, Mumbai - 400058'
  },
  {
    name: 'Royal Riders Showroom',
    location: 'Delhi',
    brands: JSON.stringify(['Royal Enfield', 'KTM', 'Ather']),
    phone: '+91 87654 32109',
    address: '45, Main Road, Karol Bagh, New Delhi - 110005'
  },
  {
    name: 'Speed Zone Auto',
    location: 'Bangalore',
    brands: JSON.stringify(['Ather', 'TVS', 'KTM', 'Yamaha']),
    phone: '+91 76543 21098',
    address: '123, MG Road, Brigade Road Junction, Bangalore - 560001'
  }
];

const sampleLaunches = [
  {
    name: 'Royal Enfield Himalayan 450',
    date: '2025-10-15',
    brand: 'Royal Enfield',
    type: 'Adventure',
    expectedPrice: 280000,
    image: 'https://images5.1000ps.net/images_bikekat/2024/15-Royal_Enfield/12308-Himalayan_410/019-638591540958684306-royal-enfield-himalayan-450.jpg',
    description: 'Next-generation adventure motorcycle with liquid-cooled engine and advanced electronics.'
  },
  {
    name: 'Ather 450S Pro',
    date: '2025-11-20',
    brand: 'Ather',
    type: 'Electric Scooter',
    expectedPrice: 165000,
    image: 'https://stat.overdrive.in/wp-content/uploads/2022/07/Ather-450X-3rd-gen-1.jpg',
    description: 'Enhanced version of popular electric scooter with improved range and fast charging.'
  },
  {
    name: 'Honda CB300F',
    date: '2025-12-10',
    brand: 'Honda',
    type: 'Naked Bike',
    expectedPrice: 220000,
    image: 'https://www.iamabiker.com/wp-content/uploads/2022/08/Honda-CB300F-HD-wallpaper-4-1536x864.jpg',
    description: 'Sporty naked motorcycle targeting young riders with modern styling and performance.'
  }
];

const sampleUsed = [
  {
    title: 'Suzuki Access 125 - 2019, single owner',
    brand: 'Suzuki',
    model: 'Access 125',
    year: 2019,
    price: 52000,
    kms: 18000,
    condition: 'Good',
    location: 'Pune',
    images: JSON.stringify([
      'https://imgcdn.oto.com/large/gallery/exterior/92/3300/suzuki-access-125-slant-front-view-full-image-535575.jpg',
    ]),
    description: 'Well maintained scooter, timely serviced, new tyres.',
    status: 'approved',
  },
  {
    title: 'Honda Activa 5G - 2018',
    brand: 'Honda',
    model: 'Activa 5G',
    year: 2018,
    price: 45000,
    kms: 24000,
    condition: 'Good',
    location: 'Bengaluru',
    images: JSON.stringify([
      'https://tse2.mm.bing.net/th/id/OIP.qa9RcfVxdF6n7Gp1_08ZWAHaFN?pid=Api&P=0&h=220',
    ]),
    description: 'Single owner, insurance valid, smooth engine.',
    status: 'approved',
  },
  {
    title: 'Yamaha FZ-S V2 - 2017',
    brand: 'Yamaha',
    model: 'FZ-S V2',
    year: 2017,
    price: 58000,
    kms: 30000,
    condition: 'Fair',
    location: 'Delhi',
    images: JSON.stringify([
      'https://tse1.mm.bing.net/th/id/OIP.kiLdqkSpWSja8jFL_1PRjAHaEK?pid=Api&P=0&h=220',
    ]),
    description: 'Minor scratches, engine in great condition.',
    status: 'approved',
  },
];

function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  db.serialize(() => {
    db.run('DELETE FROM bookings');
    db.run('DELETE FROM bikes');
    db.run('DELETE FROM showrooms');
    db.run('DELETE FROM launches');
    db.run('DELETE FROM used_bikes');

    // Insert bikes
    const bikeStmt = db.prepare(`
      INSERT INTO bikes (name, brand, price, fuelType, specs, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    sampleBikes.forEach(bike => {
      bikeStmt.run(bike.name, bike.brand, bike.price, bike.fuelType, bike.specs, bike.image);
    });
    bikeStmt.finalize();

    // Insert showrooms
    const showroomStmt = db.prepare(`
      INSERT INTO showrooms (name, location, brands, phone, address) 
      VALUES (?, ?, ?, ?, ?)
    `);

    sampleShowrooms.forEach(showroom => {
      showroomStmt.run(showroom.name, showroom.location, showroom.brands, showroom.phone, showroom.address);
    });
    showroomStmt.finalize();

    // Insert launches
    const launchStmt = db.prepare(`
      INSERT INTO launches (name, date, brand, type, expectedPrice, image, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    sampleLaunches.forEach(launch => {
      launchStmt.run(launch.name, launch.date, launch.brand, launch.type, launch.expectedPrice, launch.image, launch.description);
    });
    launchStmt.finalize();

    // Determine ownerId for used listings (first user if exists, else 1)
    db.get('SELECT id FROM users ORDER BY id ASC LIMIT 1', [], (uErr, uRow) => {
      const ownerId = uRow?.id || 1
      const usedStmt = db.prepare(`
        INSERT INTO used_bikes (title, brand, model, year, price, kms, condition, location, images, description, status, ownerId)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      sampleUsed.forEach((u) => {
        usedStmt.run(u.title, u.brand, u.model, u.year, u.price, u.kms, u.condition, u.location, u.images, u.description, u.status, ownerId)
      })
      usedStmt.finalize()

      console.log('✅ Database seeded successfully!');
      console.log(`📊 Inserted ${sampleBikes.length} bikes`);
      console.log(`🏪 Inserted ${sampleShowrooms.length} showrooms`);
      console.log(`🚀 Inserted ${sampleLaunches.length} upcoming launches`);
      console.log(`🛵 Inserted ${sampleUsed.length} used bike listings`);

      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('📁 Database connection closed');
        }
        process.exit(0);
      });
    })
  });
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
