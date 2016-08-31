module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        typescript: {
            client: {
                src: [
                    'src/**/*.ts',
                    'app/**/*.ts',
                    'main.ts'
                ],
                dest: 'web/main.js',
                compileOnSave: true,
                options: {
                    module: 'amd',
                    generateTsConfig: true,
                    references: [
                        "web/vendor/phaser/typescript/phaser.d.ts"
                    ]
                }
            }
        },
        uglify: {
            server: {
                options: {
                    mangle: false,
                    compress: false
                },
                files: {
                    'server.min.js': [
                        'server/enum.js',
                        'server/map.js',
                        'server/map/**/*.js',
                        'server/game.js',
                        'server/game/**/*.js',
                        'server/server.js',
                        'server/socket.js'
                    ]
                }
            }
        },
        watch: {
            styles: {
                files: [
                    'src/**/*.ts',
                    'app/**/*.ts',
                    'main.ts',
                    'server/enum.js',
                    'server/map.js',
                    'server/map/**/*.js',
                    'server/game.js',
                    'server/game/**/*.js',
                    'server/server.js',
                    'server/socket.js'
                ],
                tasks: ['typescript', 'uglify'],
                options: {
                    nospawn: true
                }
            }
        }
    });

    grunt.registerTask('start', ['typescript', 'uglify']);
    grunt.registerTask('default', ['typescript', 'uglify', 'watch']);
};
