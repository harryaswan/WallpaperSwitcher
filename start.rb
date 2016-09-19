puts "starting...."

pid = spawn("node index.js", :out => "test.out", :err => "test.err")

# pid = fork do
#   exec "node index.js"
# end

Process.detach(pid)

name = "exec \"kill #{pid} && rm kill.rb\""

File.write('kill.rb', name)
