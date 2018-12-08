import * as path from 'path';
import * as fs from 'fs';

function configEnvVars() {

    const options = {
        path: null,
        encoding: null,
    };

    process.argv.forEach((val, idx, arr) => {
        const matches = val.match(/^dotenv_config_(.+)=(.+)/);
        if (matches) {
            options[matches[1]] = matches[2];
        }
    });

    function parse(src) {
        const obj = {};

        // convert Buffers before splitting into lines and processing
        src.toString().split('\n').forEach((line) => {
            // matching "KEY' and 'VAL' in 'KEY=VAL'
            const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
            // matched?
            if (keyValueArr != null) {
                const key = keyValueArr[1];

                // default undefined or missing values to empty string
                let value = keyValueArr[2] || '';

                // expand newlines in quoted values
                const len = value ? value.length : 0;
                if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
                    value = value.replace(/\\n/gm, '\n');
                }

                // remove any surrounding quotes and extra spaces
                value = value.replace(/(^['"]|['"]$)/g, '').trim();

                obj[key] = value;
            }
        });

        return obj;
    }

    let dotenvPath = path.resolve(process.cwd(), '.env');
    let encoding = 'utf8';

    // console.log(`Reading .env file from ${dotenvPath}`);

    try {

        if (options) {
            if (options.path) {
                dotenvPath = options.path;
            }
            if (options.encoding) {
                encoding = options.encoding;
            }
        }

        // specifying an encoding returns a string instead of a buffer
        const parsed = parse(fs.readFileSync(dotenvPath, { encoding }));

        Object.keys(parsed).forEach((key) => {
            if (!process.env.hasOwnProperty(key)) {
                process.env[key] = parsed[key];
            }
        });

    } catch (e) {
        // console.log({error: e});
    }

    return process.env;

}

export default configEnvVars();