var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");

http.createServer(function (req, res) {
    var file = path.resolve(__dirname,"movie4.mp4");
    var range1 = req.headers.range;
    var range = null;
    if(range1 == null){
        range = "bytes=0-";
    }else{
        range = range1;
    }
  //  console.log("range="+range)
    var positions = range.replace(/bytes=/, "").split("-");
    var start = parseInt(positions[0], 10);
    fs.stat(file, function(err, stats) {
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : start+4096;
        if(end >= total){
            end = total-1;
        }
        var chunksize = (end - start) + 1;
        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });
        console.log("bytes=" + start + "-" + end + "/" + total);
        var stream = fs.createReadStream(file, { start: start, end: end })
            .on("open", function() {
                stream.pipe(res);
            }).on("error", function(err) {
                res.end(err);
                console.log("err");
            }).on("data",function(chunked){
                console.log(chunked.length);
            }).on("end",function(err){
                //console.log("end");
            });


    });
}).listen(3000);
