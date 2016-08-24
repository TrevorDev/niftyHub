interface cylon {
    config:any;
    robot:any;
}
declare module "cylon" {
    var x:cylon;

    export = x;
}
