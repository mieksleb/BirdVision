# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.15

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:


#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:


# Remove some rules from gmake that .SUFFIXES does not remove.
SUFFIXES =

.SUFFIXES: .hpux_make_needs_suffix_list


# Suppress display of executed commands.
$(VERBOSE).SILENT:


# A target that is always out of date.
cmake_force:

.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake

# The command to remove a file.
RM = /Applications/CLion.app/Contents/bin/cmake/mac/bin/cmake -E remove -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /Users/michaelselby/BirdVision

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /Users/michaelselby/BirdVision/cmake-build-debug

# Include any dependencies generated for this target.
include CMakeFiles/BirdVision.dir/depend.make

# Include the progress variables for this target.
include CMakeFiles/BirdVision.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/BirdVision.dir/flags.make

CMakeFiles/BirdVision.dir/main.cpp.o: CMakeFiles/BirdVision.dir/flags.make
CMakeFiles/BirdVision.dir/main.cpp.o: ../main.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/michaelselby/BirdVision/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/BirdVision.dir/main.cpp.o"
	/Library/Developer/CommandLineTools/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/BirdVision.dir/main.cpp.o -c /Users/michaelselby/BirdVision/main.cpp

CMakeFiles/BirdVision.dir/main.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/BirdVision.dir/main.cpp.i"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/michaelselby/BirdVision/main.cpp > CMakeFiles/BirdVision.dir/main.cpp.i

CMakeFiles/BirdVision.dir/main.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/BirdVision.dir/main.cpp.s"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/michaelselby/BirdVision/main.cpp -o CMakeFiles/BirdVision.dir/main.cpp.s

CMakeFiles/BirdVision.dir/vector_tools.cpp.o: CMakeFiles/BirdVision.dir/flags.make
CMakeFiles/BirdVision.dir/vector_tools.cpp.o: ../vector_tools.cpp
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/Users/michaelselby/BirdVision/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/BirdVision.dir/vector_tools.cpp.o"
	/Library/Developer/CommandLineTools/usr/bin/c++  $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -o CMakeFiles/BirdVision.dir/vector_tools.cpp.o -c /Users/michaelselby/BirdVision/vector_tools.cpp

CMakeFiles/BirdVision.dir/vector_tools.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/BirdVision.dir/vector_tools.cpp.i"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /Users/michaelselby/BirdVision/vector_tools.cpp > CMakeFiles/BirdVision.dir/vector_tools.cpp.i

CMakeFiles/BirdVision.dir/vector_tools.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/BirdVision.dir/vector_tools.cpp.s"
	/Library/Developer/CommandLineTools/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /Users/michaelselby/BirdVision/vector_tools.cpp -o CMakeFiles/BirdVision.dir/vector_tools.cpp.s

# Object files for target BirdVision
BirdVision_OBJECTS = \
"CMakeFiles/BirdVision.dir/main.cpp.o" \
"CMakeFiles/BirdVision.dir/vector_tools.cpp.o"

# External object files for target BirdVision
BirdVision_EXTERNAL_OBJECTS =

BirdVision: CMakeFiles/BirdVision.dir/main.cpp.o
BirdVision: CMakeFiles/BirdVision.dir/vector_tools.cpp.o
BirdVision: CMakeFiles/BirdVision.dir/build.make
BirdVision: CMakeFiles/BirdVision.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/Users/michaelselby/BirdVision/cmake-build-debug/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable BirdVision"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/BirdVision.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/BirdVision.dir/build: BirdVision

.PHONY : CMakeFiles/BirdVision.dir/build

CMakeFiles/BirdVision.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/BirdVision.dir/cmake_clean.cmake
.PHONY : CMakeFiles/BirdVision.dir/clean

CMakeFiles/BirdVision.dir/depend:
	cd /Users/michaelselby/BirdVision/cmake-build-debug && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /Users/michaelselby/BirdVision /Users/michaelselby/BirdVision /Users/michaelselby/BirdVision/cmake-build-debug /Users/michaelselby/BirdVision/cmake-build-debug /Users/michaelselby/BirdVision/cmake-build-debug/CMakeFiles/BirdVision.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/BirdVision.dir/depend

