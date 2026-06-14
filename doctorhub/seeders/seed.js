require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const db = require('../models');

async function seed() {
  try {
    console.log('Connecting to MySQL to check/create database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    console.log(`Database ${process.env.DB_NAME} created or already exists.`);
    await connection.end();

    console.log('Syncing models...');
    await db.sequelize.sync({ force: true });

    const [superAdminPass, adminPass, doctorPass, patientPass, assistPass] = await Promise.all([
      bcrypt.hash('SuperAdmin@123', 10),
      bcrypt.hash('Admin@123', 10),
      bcrypt.hash('Doctor@123', 10),
      bcrypt.hash('Patient@123', 10),
      bcrypt.hash('Assist@123', 10)
    ]);

    console.log('Inserting Users...');
    const superAdmin = await db.User.create({ name: 'Super Admin', email: 'superadmin@doctorhub.com', password: superAdminPass, role: 'super_admin' });
    const admin = await db.User.create({ name: 'Admin User', email: 'admin@doctorhub.com', password: adminPass, role: 'admin' });
    
    const docUser1 = await db.User.create({ name: 'Dr. Ali Khan', email: 'dr.ali@doctorhub.com', password: doctorPass, role: 'doctor' });
    const docUser2 = await db.User.create({ name: 'Dr. Sara Ahmed', email: 'dr.sara@doctorhub.com', password: doctorPass, role: 'doctor' });
    const docUser3 = await db.User.create({ name: 'Dr. Usman Raza', email: 'dr.usman@doctorhub.com', password: doctorPass, role: 'doctor' });
    
    const patUser1 = await db.User.create({ name: 'Ahmed Raza', email: 'patient1@doctorhub.com', password: patientPass, role: 'patient' });
    const patUser2 = await db.User.create({ name: 'Fatima Noor', email: 'patient2@doctorhub.com', password: patientPass, role: 'patient' });
    
    const assistUser1 = await db.User.create({ name: 'Zara Ali', email: 'assistant1@doctorhub.com', password: assistPass, role: 'assistant' });

    console.log('Inserting Doctors...');
    const doctor1 = await db.Doctor.create({ user_id: docUser1.id, specialization: 'General Physician', treatment_type: 'Allopathic', diseases_treated: ["fever","flu","diabetes","hypertension"], experience_years: 10, consultation_fee: 1000, is_verified: true });
    const doctor2 = await db.Doctor.create({ user_id: docUser2.id, specialization: 'Homeopathy', treatment_type: 'Homeopathic', diseases_treated: ["skin allergy","asthma","migraine"], experience_years: 5, consultation_fee: 800, is_verified: true });
    const doctor3 = await db.Doctor.create({ user_id: docUser3.id, specialization: 'Herbal Medicine', treatment_type: 'Herbal', diseases_treated: ["joint pain","digestive issues","anxiety"], experience_years: 8, consultation_fee: 700, is_verified: true });

    console.log('Inserting Clinics...');
    await db.Clinic.create({ doctor_id: doctor1.id, name: 'Ali Health Care', address: 'DHA Phase 1', city: 'Lahore', phone: '03001234567', timings: { monday: '09:00-17:00' } });
    await db.Clinic.create({ doctor_id: doctor2.id, name: 'Sara Homeopathic Clinic', address: 'Gulberg 3', city: 'Lahore', phone: '03001234568', timings: { tuesday: '10:00-18:00' } });
    await db.Clinic.create({ doctor_id: doctor3.id, name: 'Usman Herbal Source', address: 'Johar Town', city: 'Lahore', phone: '03001234569', timings: { wednesday: '11:00-19:00' } });

    console.log('Inserting Patients...');
    await db.Patient.create({ user_id: patUser1.id, date_of_birth: '1995-05-15', gender: 'male' });
    await db.Patient.create({ user_id: patUser2.id, date_of_birth: '1998-08-20', gender: 'female' });

    console.log('Inserting Assistants...');
    await db.Assistant.create({ user_id: assistUser1.id, doctor_id: doctor1.id });

    console.log('Seeder completed successfully. Database is ready.');
    process.exit(0);

  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
}

seed();
