const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
console.log('✅ .env.local found. Parsing...');

const lines = content.split('\n');
const env = {};

lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...values] = trimmed.split('=');
    if (key && values.length > 0) {
        let value = values.join('=');
        // Simple unquote
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
        }
        env[key.trim()] = value;
    }
});

const requiredKeys = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY'
];

let hasError = false;

requiredKeys.forEach(key => {
    if (env[key]) {
        console.log(`✅ ${key} is present.`);
        if (key === 'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY') {
            const val = env[key];
            if (val.includes('\\n')) {
                console.log(`   ℹ️ Private key contains escaped newlines (\\n). This is expected for .env files.`);
            }
            if (val.includes('BEGIN PRIVATE KEY')) {
                console.log(`   ✅ Private key content looks correct (header found).`);
            } else {
                console.log(`   ⚠️ Private key content might be missing header.`);
            }
        }
    } else {
        console.log(`❌ ${key} is MISSING.`);
        hasError = true;
    }
});

if (hasError) {
    console.error('\n❌ Validations failed.');
} else {
    console.log('\n✅ All Service Account variables appear to be present in .env.local.');
    console.log('👉 If you are still seeing errors, try RESTARTING your development server.');
}
