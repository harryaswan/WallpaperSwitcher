dir = Dir.getwd

puts "Setting file://#{dir}/#{ARGV[0]} as wallpaper"

exec "gsettings set org.gnome.desktop.background picture-uri file://#{dir}/#{ARGV[0]}"
# puts "test"
# sleep 1000
# exec "gsettings set org.gnome.desktop.background picture-options scaled"
# puts "done"
