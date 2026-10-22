// Fills the database with sample tasks so the cache benefit is easy to see.
//   node scripts/seed.js          -> adds 2000 sample tasks
//   node scripts/seed.js 5000     -> adds 5000
//   node scripts/seed.js --clear  -> removes ONLY the sample tasks it created
require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('../models/Task');

const PREFIX = '[sample] ';
const PRIORITIES = ['low', 'medium', 'high'];

async function main() {
    await mongoose.connect(process.env.MONGO_URI);

    if (process.argv.includes('--clear')) {
        const res = await Task.deleteMany({ title: { $regex: '^\\[sample\\] ' } });
        console.log(`Removed ${res.deletedCount} sample tasks`);
    } else {
        const count = Number(process.argv[2]) || 2000;
        const docs = Array.from({ length: count }, (_, i) => ({
            title: `${PREFIX}Task ${i + 1}`,
            description: `Auto-generated task number ${i + 1} used for cache benchmarking.`,
            priority: PRIORITIES[i % 3],
            completed: i % 4 === 0,
        }));
        await Task.insertMany(docs);
        console.log(`Inserted ${count} sample tasks`);
    }

    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err.message);
    process.exit(1);
});