 ps aux | grep node | awk '{print $1}' | xargs kill -9
