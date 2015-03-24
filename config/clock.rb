require 'clockwork'
require_relative './boot'
require_relative './environment'

include Clockwork

handler do |job|
  puts "Doing bookings!"
end

every(1.minute + 30.seconds, 'Send Messages') {
  `rake perform_bookings`
}
