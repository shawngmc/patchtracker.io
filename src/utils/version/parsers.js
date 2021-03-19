const _ = require('lodash');
const semver = require('semver');

const semverBuildRegex = new RegExp("^(\\d+)\.(\\d+)\.(\\d+)(?:\\.)?(\\d+)?$");

function parse(parseString, pollConfig) {
    var val = parseString;
    for (const opConfig of pollConfig.parse) {
        if (opConfig.method == "parseSemver") {
            val = parseSemver(val, opConfig);
        } else if (opConfig.method == "parseSemverBuild") {
            val = parseSemverBuild(val, opConfig);
        } else if (opConfig.method == "applyRegex") {
            val = applyRegex(val, opConfig);
        } else if (opConfig.method == "parseSpring") {
            val = parseSpring(val, opConfig);
        } else if (opConfig.method == "convertPrereleaseToSubpatch") {
            val = convertPrereleaseToSubpatch(val, opConfig);
        }
        console.log(val);
        if (val == null) {
            return null;
        }
    }

    return val;
}

function parseSemver(val, opConfig) {
    let parseLoose = (opConfig.loose != undefined) ? opConfig.loose : false;
    let dropPrereleaseVersions = (opConfig.dropPrereleaseVersions != undefined) ? opConfig.dropPrereleaseVersions : true;
    
    let version = semver.clean(val, { loose : parseLoose }); 

    // For now, drop all prerelease builds
    if (version == null) {
        return null;
    } else if (dropPrereleaseVersions && (semver.prerelease(version) != null)) {
        console.log("Dropping prerelease build!");
        return null;
    }

    let verObj = {
        version: version,
        major: semver.major(version),
        minor: semver.minor(version),
        patch: semver.patch(version),
        subpatch: null,
        prerelease: semver.prerelease(version)
    }

    return verObj;
}

function parseSemverBuild(val) {
    let verObj = null;
    if (semverBuildRegex.test(val)) {
        verObj = {
            version: val,
            major: parseInt(val.replace(semverBuildRegex, "$1")),
            minor: parseInt(val.replace(semverBuildRegex, "$2")),
            patch: parseInt(val.replace(semverBuildRegex, "$3")),
            subpatch: parseInt(val.replace(semverBuildRegex, "$4")),
            prerelease: null
        }
    }
    return verObj;
}

function applyRegex(val, opConfig) {
    var regex = new RegExp(opConfig.pattern);
    
    let passthrough = (opConfig.passthrough != undefined) ? opConfig.passthrough : false;
    if (regex.test(val)) {
        return opConfig.replace ? val.replace(regex, opConfig.replace) : val;
    } else if (passthrough) {
        return val;
    }
    console.log("regex failed")
    return null;
}

function parseSpring(parseString, pollConfig) {
    // Spring.io uses an inconsistent, bad naming scheme
    // release: v1.2.3.RELEASE
    // test: v.1.2.3(. or -)M1

    console.log(`parseString: ${parseString}`);
    // First, if this is a release, drop the .RELEASE and parse with semver
    if (parseString.endsWith('.RELEASE')) {
        return parseSemver(parseString.substring(0, parseString.length - 8), pollConfig);
    }

    // // Otherwise, we need to make sure the 4th delimiter is a - to ensure the semver lib doesn't complain
    // let regexStr = "v(\\d+\\.\\d+\\.\\d+)\\.(.+)$";
    // let regexObj = new RegExp(regexStr);
    // let verString = parseString.replace(regexObj, "$1-$2");
    // console.log(`verString: ${verString}`);
    // return parseSemver(verString);

    // While the code above works, for now, just DROP beta and RC releases.
    console.log("Dropping prerelease build!");
    return null;
}



function convertPrereleaseToSubpatch(val, opConfig) {
    console.log("converting pre to sub")
    val.subpatch = val.prerelease;
    val.prerelease = null;
    return val;
}

module.exports = {
    parse: parse
}