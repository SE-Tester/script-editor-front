dt=$(date '+%d%m%Y_%H%M%S');
IFS=',' read -r -a ips <<< "$1"
echo "Release datetime: $dt"

# Upload new version
for host in "${ips[@]}"
do
    IFS=':' read -r -a host <<< "$host"
    port=${host[1]}
    ip=${host[0]}
    echo "Upload to > $PROD_SSH_USER@$ip:$port"
    scp -P$port build.tgz $PROD_SSH_USER@$ip:/tmp/
    ssh $PROD_SSH_USER@$ip -t -p $port "tar -xf /tmp/build.tgz -C /tmp/ && mv /tmp/build $PROD_PROJECT_DIR/$dt"
done

# Change version
for host in "${ips[@]}"
do
    IFS=':' read -r -a host <<< "$host"
    port=${host[1]}
    ip=${host[0]}
    echo "Change version in $PROD_SSH_USER@$ip:$port"
    ssh $PROD_SSH_USER@$ip -t -p $port "rm -rf $PROD_PROJECT_DIR/current && ln -s $PROD_PROJECT_DIR/$dt $PROD_PROJECT_DIR/current"
done

