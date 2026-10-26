(module
 (memory (import "runtime" "memory") 128)
 (import "runtime" "f15638" (func $f15638 (param i32 i32)))
 (import "runtime" "f16624" (func $f16624 (param i32 i32 i32)))
 (import "runtime" "f20604" (func $f20604 (param i32 i32) (result i32)))
 (import "runtime" "f22860" (func $f22860 (param i32 i32 i32)))
 (import "runtime" "f23815" (func $f23815 (param i32 i32)))
 (import "runtime" "f23834" (func $f23834 (param i32 i32)))
 (import "runtime" "f23889" (func $f23889 (param i32 i32)))
 (import "runtime" "f24039" (func $f24039 (param i32 i32 i32)))
 (import "runtime" "f26874" (func $f26874 (param i32 i32 i32 i32) (result i32)))
 (import "runtime" "f26888" (func $f26888 (param i32 i32 i32) (result i32)))
 (import "runtime" "f26893" (func $f26893 (param i32 i32 i32) (result i32)))
 (import "runtime" "f27066" (func $f27066 (param i32 i32) (result i32)))
 (import "runtime" "f29529" (func $f29529 (param i32) (result i32)))
 (import "runtime" "f30625" (func $f30625 (param i32) (result f32)))
 (import "runtime" "f31839" (func $f31839 (param i32 i32)))
 (import "runtime" "f31843" (func $f31843 (param i32 i32)))
 (import "runtime" "f31864" (func $f31864 (param i32 i32)))
 (import "runtime" "f31865" (func $f31865 (param i32 i32)))
 (import "runtime" "f31866" (func $f31866 (param i32 i32 i32)))
 (import "runtime" "f31869" (func $f31869 (param i32 i32 i32 i32 i32 i32)))
 (import "runtime" "f31870" (func $f31870 (param i32 i32 i32)))
 (import "runtime" "f31876" (func $f31876 (param i32 i32 i32 i32 i32)))
 (import "runtime" "f31879" (func $f31879 (param i32 i32 i32)))
 (import "runtime" "f31885" (func $f31885 (param i32 i32)))
 (import "runtime" "f31886" (func $f31886 (param i32 i32)))
 (import "runtime" "f31888" (func $f31888 (param i32 i32)))
 (import "runtime" "f31890" (func $f31890 (param i32 i32 i32)))
 (import "runtime" "f31891" (func $f31891 (param i32 i32 i32 i32)))
 (import "runtime" "f31901" (func $f31901 (param i32 i32)))
 (import "runtime" "f32880" (func $f32880 (param i32 i32) (result i32)))
 (import "runtime" "f33424" (func $f33424 (param i32)))
 (import "runtime" "f34102" (func $f34102 (param i32)))
 (global $stack (mut i32) (i32.const 3000000))
  (func $GameController_Start (param i32 i32)
    i32.const 2496692
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358868
      i32.load
      call $f34102
      i32.const 2496692
      i32.const 1
      i32.store8
    end
    i32.const 1955504
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    local.get 0
    i32.const 52
    i32.add
    i32.const 1957464
    i32.load
    call $f29529
    i32.store
    local.get 0
    i32.const 56
    i32.add
    i32.const 1957456
    i32.load
    call $f29529
    i32.store
    local.get 0
    i32.const 60
    i32.add
    i32.const 1957460
    i32.load
    call $f29529
    i32.store
    local.get 0
    i32.load offset=56
    local.get 0
    i32.load offset=68
    i32.const 0
    call $IntroManager_ShowIntro
    local.get 0
    i32.const 0
    call $f30625
    f32.const 0x1p-1 (;=0.5;)
    f32.gt
    i32.store8 offset=49)

 (export "GameController_Start" (func $GameController_Start))
  (func $GameController_GotoCasa (param i32 i32)
    i32.const 2496695
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358824
      i32.load
      call $f34102
      i32.const 2496695
      i32.const 1
      i32.store8
    end
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1987888
    i32.load
    i32.const 0
    call $f23889
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 4
    i32.const 0
    call $f31843
    local.get 0
    i32.const 1
    i32.store offset=76
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1987896
    i32.load
    i32.store
    local.get 0
    i32.const 88
    i32.add
    i32.const 1987900
    i32.load
    i32.store
    local.get 0
    i32.const 92
    i32.add
    i32.const 1987904
    i32.load
    i32.store
    local.get 0
    i32.const 96
    i32.add
    i32.const 1987908
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=35
    if  ;; label = @1
      local.get 0
      i32.const 100
      i32.add
      i32.const 1987912
      i32.load
      i32.store
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    local.get 0
    i32.load offset=100
    i32.const 0
    call $f31869
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoCasa" (func $GameController_GotoCasa))
  (func $GameController_GotoParque (param i32 i32)
    i32.const 2496699
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358836
      i32.load
      call $f34102
      i32.const 2496699
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 7
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1987916
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 2
    i32.store offset=76
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1987920
    i32.load
    i32.store
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 4
    i32.le_s
    if  ;; label = @1
      local.get 0
      i32.load8_s offset=33
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.const 88
        i32.add
        i32.const 1987924
        i32.load
        i32.store
      end
    end
    local.get 0
    i32.load8_s offset=34
    i32.eqz
    if  ;; label = @1
      local.get 0
      i32.const 92
      i32.add
      i32.const 1987928
      i32.load
      i32.store
    end
    local.get 0
    i32.const 96
    i32.add
    i32.const 1987932
    i32.load
    i32.store
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 4
    i32.lt_s
    local.get 0
    i32.load8_s offset=29
    i32.const 0
    i32.ne
    i32.const 1
    i32.xor
    i32.and
    if  ;; label = @1
      local.get 0
      i32.const 100
      i32.add
      i32.const 1987936
      i32.load
      i32.store
    else
      local.get 0
      i32.const -64
      i32.sub
      i32.load
      i32.const 4
      i32.ge_s
      if  ;; label = @2
        local.get 0
        i32.const 100
        i32.add
        i32.const 1987940
        i32.load
        i32.store
      end
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    local.get 0
    i32.load offset=100
    i32.const 0
    call $f31869
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoParque" (func $GameController_GotoParque))
  (func $GameController_GotoAbocador (param i32 i32)
    i32.const 2496700
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358812
      i32.load
      call $f34102
      i32.const 2496700
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 5
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1987944
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 3
    i32.store offset=76
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1987948
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=49
    if  ;; label = @1
      local.get 0
      i32.const 84
      i32.add
      local.get 0
      i32.load offset=84
      i32.const 1987952
      i32.load
      i32.const 0
      call $f26888
      i32.store
    end
    local.get 0
    i32.const 84
    i32.add
    local.get 0
    i32.load offset=84
    i32.const 1987956
    i32.load
    i32.const 0
    call $f26888
    i32.store
    local.get 0
    i32.const 88
    i32.add
    i32.const 1987960
    i32.load
    i32.store
    local.get 0
    i32.const 92
    i32.add
    i32.const 1987964
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=49
    if  ;; label = @1
      local.get 0
      i32.const 96
      i32.add
      i32.const 1987968
      i32.load
      i32.store
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    i32.const 0
    call $f31876
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoAbocador" (func $GameController_GotoAbocador))
  (func $GameController_GotoAlmacen (param i32 i32)
    i32.const 2496702
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358820
      i32.load
      call $f34102
      i32.const 2496702
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 6
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1987972
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 4
    i32.store offset=76
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1987976
    i32.load
    i32.store
    block  ;; label = @1
      local.get 0
      i32.const -64
      i32.sub
      i32.load
      i32.const 1
      i32.eq
      if  ;; label = @2
        local.get 0
        i32.const 84
        i32.add
        local.get 0
        i32.load offset=84
        i32.const 1987980
        i32.load
        i32.const 0
        call $f26888
        i32.store
      else
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 2
        i32.eq
        if  ;; label = @3
          local.get 0
          i32.const 84
          i32.add
          local.get 0
          i32.load offset=84
          i32.const 1987984
          i32.load
          i32.const 0
          call $f26888
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 3
        i32.eq
        if  ;; label = @3
          local.get 0
          i32.const 84
          i32.add
          local.get 0
          i32.load offset=84
          i32.const 1987984
          i32.load
          i32.const 0
          call $f26888
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 4
        i32.eq
        if  ;; label = @3
          local.get 0
          i32.const 84
          i32.add
          local.get 0
          i32.load offset=84
          i32.const 1987988
          i32.load
          i32.const 0
          call $f26888
          i32.store
          br 2 (;@1;)
        end
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 5
        i32.eq
        if  ;; label = @3
          local.get 0
          i32.const 84
          i32.add
          local.get 0
          i32.load offset=84
          i32.const 1987992
          i32.load
          i32.const 0
          call $f26888
          i32.store
        end
      end
    end
    local.get 0
    i32.const 88
    i32.add
    i32.const 1987996
    i32.load
    i32.store
    local.get 0
    i32.const 92
    i32.add
    i32.const 1988000
    i32.load
    i32.store
    local.get 0
    i32.const 96
    i32.add
    i32.const 1988004
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=15
    if  ;; label = @1
      local.get 0
      i32.const 100
      i32.add
      i32.const 1988008
      i32.load
      i32.store
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    local.get 0
    i32.load offset=100
    i32.const 0
    call $f31869
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoAlmacen" (func $GameController_GotoAlmacen))
  (func $GameController_GotoPizza (param i32 i32)
    i32.const 2496703
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358844
      i32.load
      call $f34102
      i32.const 2496703
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 10
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1988012
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 5
    i32.store offset=76
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=43
    if  ;; label = @1
      local.get 0
      i32.const 84
      i32.add
      i32.const 1988020
      i32.load
      i32.store
    else
      local.get 0
      i32.const 84
      i32.add
      i32.const 1988016
      i32.load
      i32.store
      local.get 0
      i32.const 1
      i32.store8 offset=43
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=72
    i32.const 0
    call $f31879
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoPizza" (func $GameController_GotoPizza))
  (func $GameController_GotoAigua (param i32 i32)
    i32.const 2496705
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358816
      i32.load
      call $f34102
      i32.const 2496705
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 8
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1988024
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 6
    i32.store offset=76
    local.get 0
    i32.const 88
    i32.add
    i32.const 1976876
    i32.load
    i32.store
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1988028
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1988032
    i32.load
    i32.store
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    i32.const 0
    call $f31879
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoAigua" (func $GameController_GotoAigua))
  (func $GameController_GotoPasseig (param i32 i32)
    i32.const 2496706
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358840
      i32.load
      call $f34102
      i32.const 2496706
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 11
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1988036
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 7
    i32.store offset=76
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.load8_s offset=39
    if  ;; label = @1
      local.get 0
      i32.const 1
      i32.store8 offset=39
      local.get 0
      i32.const 84
      i32.add
      i32.const 1988044
      i32.load
      i32.store
    else
      local.get 0
      i32.const 84
      i32.add
      i32.const 1988040
      i32.load
      i32.store
    end
    local.get 0
    i32.const 88
    i32.add
    i32.const 1988048
    i32.load
    i32.store
    local.get 0
    i32.const 92
    i32.add
    i32.const 1976112
    i32.load
    i32.store
    local.get 0
    i32.const 96
    i32.add
    i32.const 1988052
    i32.load
    i32.store
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 3
    i32.gt_s
    if  ;; label = @1
      local.get 0
      i32.load8_s offset=41
      i32.eqz
      if  ;; label = @2
        local.get 0
        i32.const 92
        i32.add
        i32.const 1988056
        i32.load
        i32.store
        local.get 0
        i32.const 1
        i32.store8 offset=13
      end
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    i32.const 0
    call $f31876
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoPasseig" (func $GameController_GotoPasseig))
  (func $GameController_GotoEscola (param i32 i32)
    i32.const 2496707
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358828
      i32.load
      call $f34102
      i32.const 2496707
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 9
    i32.const 0
    call $f31843
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1988060
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 8
    i32.store offset=76
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1987892
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1988064
    i32.load
    i32.store
    local.get 0
    i32.const 88
    i32.add
    i32.const 1988068
    i32.load
    i32.store
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 2
    i32.le_s
    if  ;; label = @1
      local.get 0
      i32.const 92
      i32.add
      i32.const 1988072
      i32.load
      i32.store
    end
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 3
    i32.eq
    if  ;; label = @1
      local.get 0
      i32.const 96
      i32.add
      i32.const 1988076
      i32.load
      i32.store
    end
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=88
    local.get 0
    i32.load offset=92
    local.get 0
    i32.load offset=96
    i32.const 0
    call $f31876
    local.get 0
    i32.load offset=52
    local.get 0
    i32.load offset=84
    i32.const 0
    call $f31870)

 (export "GameController_GotoEscola" (func $GameController_GotoEscola))
  (func $GameController_GotoMapa (param i32 i32)
    i32.const 2496708
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358832
      i32.load
      call $f34102
      i32.const 2496708
      i32.const 1
      i32.store8
    end
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 1988080
    i32.load
    i32.const 0
    call $f23889
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 3
    i32.const 0
    call $f31843
    local.get 0
    i32.const 0
    i32.store offset=76
    local.get 0
    i32.const -64
    i32.sub
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 1
    i32.add
    i32.store
    local.get 0
    i32.const -64
    i32.sub
    i32.load
    i32.const 5
    i32.gt_s
    if  ;; label = @1
      local.get 0
      i32.const 0
      call $GameController_TimeTravel
    end
    local.get 0
    i32.load offset=52
    i32.const 0
    call $f31885)

 (export "GameController_GotoMapa" (func $GameController_GotoMapa))
  (func $GameController_Option1 (param i32 i32)
    (local i32)
    i32.const 2496710
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358848
      i32.load
      call $f34102
      i32.const 2496710
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    i32.const 1988084
    i32.load
    local.get 0
    i32.load offset=80
    i32.const 0
    call $f26888
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    call $f23889
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 0
                        i32.load offset=76
                        i32.const 1
                        i32.sub
                        br_table 0 (;@10;) 1 (;@9;) 2 (;@8;) 3 (;@7;) 4 (;@6;) 5 (;@5;) 6 (;@4;) 7 (;@3;) 8 (;@2;)
                      end
                      local.get 0
                      i32.load offset=80
                      i32.const 1987892
                      i32.load
                      i32.const 0
                      call $f26893
                      i32.eqz
                      if  ;; label = @10
                        local.get 0
                        i32.load offset=80
                        i32.const 1988160
                        i32.load
                        i32.const 0
                        call $f26893
                        i32.eqz
                        if  ;; label = @11
                          local.get 0
                          i32.load offset=80
                          i32.const 1988184
                          i32.load
                          i32.const 0
                          call $f26893
                          if  ;; label = @12
                            local.get 0
                            i32.const 0
                            call $GameController_TimeTravel
                            br 11 (;@1;)
                          end
                          i32.const 1955484
                          i32.load
                          local.tee 1
                          i32.load16_s offset=186
                          i32.const 512
                          i32.and
                          if  ;; label = @12
                            local.get 1
                            i32.load offset=116
                            i32.eqz
                            if  ;; label = @13
                              local.get 1
                              call $f33424
                            end
                          end
                          i32.const 1988188
                          i32.load
                          i32.const 0
                          call $f23889
                          local.get 0
                          i32.const 0
                          call $GameController_GotoMapa
                          br 10 (;@1;)
                        end
                        local.get 0
                        i32.const 80
                        i32.add
                        i32.const 1988164
                        i32.load
                        i32.store
                        local.get 0
                        i32.const 84
                        i32.add
                        i32.const 1988168
                        i32.load
                        i32.store
                        local.get 0
                        i32.const -64
                        i32.sub
                        i32.load
                        i32.const 1
                        i32.eq
                        local.get 0
                        i32.const -64
                        i32.sub
                        i32.load
                        i32.const 3
                        i32.eq
                        i32.or
                        local.get 0
                        i32.const -64
                        i32.sub
                        i32.load
                        i32.const 4
                        i32.eq
                        i32.or
                        if  ;; label = @11
                          local.get 0
                          i32.const 84
                          i32.add
                          local.get 0
                          i32.load offset=84
                          i32.const 1988172
                          i32.load
                          i32.const 0
                          call $f26888
                          i32.store
                        else
                          local.get 0
                          i32.load8_s offset=32
                          i32.eqz
                          if  ;; label = @12
                            local.get 0
                            i32.load8_s offset=17
                            if  ;; label = @13
                              local.get 0
                              i32.const 84
                              i32.add
                              local.get 0
                              i32.load offset=84
                              i32.const 1988176
                              i32.load
                              i32.const 0
                              call $f26888
                              i32.store
                            end
                          end
                          local.get 0
                          i32.load8_s offset=17
                          i32.eqz
                          if  ;; label = @12
                            local.get 0
                            i32.const 84
                            i32.add
                            local.get 0
                            i32.load offset=84
                            i32.const 1988180
                            i32.load
                            i32.const 0
                            call $f26888
                            i32.store
                          end
                        end
                        local.get 0
                        i32.load offset=52
                        local.get 0
                        i32.load offset=72
                        i32.const 0
                        call $f31879
                        local.get 0
                        i32.load offset=52
                        local.get 0
                        i32.load offset=84
                        i32.const 0
                        call $f31890
                        br 9 (;@1;)
                      end
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988088
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988092
                      i32.load
                      i32.store
                      local.get 0
                      i32.load8_s offset=14
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988096
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=15
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988100
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=23
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988104
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=12
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988108
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=13
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988112
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=21
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988116
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=19
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988120
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=17
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988124
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=16
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988128
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=24
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988132
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=18
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988136
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=25
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988140
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=26
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988144
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=20
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988148
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=28
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988152
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load8_s offset=27
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1988156
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1987892
                    i32.load
                    i32.const 0
                    call $f26893
                    local.get 0
                    i32.load8_s offset=30
                    i32.const 0
                    i32.ne
                    i32.const 1
                    i32.xor
                    i32.and
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988088
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988192
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1988196
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1988200
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1988204
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=88
                      local.get 0
                      i32.load offset=92
                      local.get 0
                      i32.load offset=96
                      i32.const 0
                      call $f31876
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1987892
                    i32.load
                    i32.const 0
                    call $f26893
                    local.get 0
                    i32.load8_s offset=30
                    i32.const 0
                    i32.ne
                    i32.and
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988208
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988212
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1988216
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1988220
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1988224
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 0
                      i32.store8 offset=30
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=88
                      local.get 0
                      i32.load offset=92
                      local.get 0
                      i32.load offset=96
                      i32.const 0
                      call $f31876
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988228
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988232
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988236
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988088
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988160
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 1
                      i32.store8 offset=31
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988240
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988208
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988244
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988248
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1988252
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1988256
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1988260
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      local.get 0
                      i32.const 1
                      i32.store8 offset=33
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988244
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988184
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988264
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1988252
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1988256
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1988260
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=88
                      local.get 0
                      i32.load offset=92
                      local.get 0
                      i32.load offset=96
                      i32.const 0
                      call $f31876
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988184
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988268
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988272
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 1
                      i32.store8 offset=36
                      local.get 0
                      i32.const 1
                      i32.store8 offset=31
                      local.get 0
                      i32.const 1
                      i32.store8 offset=22
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988276
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988280
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988284
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1988288
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1988292
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=88
                      local.get 0
                      i32.load offset=92
                      i32.const 0
                      call $f31891
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988280
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988296
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988300
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988304
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988308
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988312
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988316
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988320
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988324
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988328
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988332
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988336
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 1
                      i32.store8 offset=34
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988332
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988340
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988344
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988348
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988352
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988356
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988352
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988360
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1988364
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 1
                      i32.store8 offset=32
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    block  ;; label = @9
                      i32.const 1955484
                      i32.load
                      local.tee 1
                      i32.load16_s offset=186
                      i32.const 512
                      i32.and
                      if  ;; label = @10
                        local.get 1
                        i32.load offset=116
                        br_if 1 (;@9;)
                        local.get 1
                        call $f33424
                      end
                    end
                    i32.const 1988188
                    i32.load
                    i32.const 0
                    call $f23889
                    local.get 0
                    i32.const 0
                    call $GameController_GotoMapa
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1987892
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988088
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988368
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988160
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988164
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988372
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 1
                    i32.store8 offset=35
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988184
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988376
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988380
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1988384
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1988388
                    i32.load
                    i32.store
                    local.get 0
                    i32.load8_s offset=36
                    if  ;; label = @9
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1988392
                      i32.load
                      i32.store
                    end
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    local.get 0
                    i32.load offset=96
                    i32.const 0
                    call $f31876
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988376
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988396
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988400
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1988404
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1988408
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988376
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988316
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988412
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    local.get 0
                    i32.const 0
                    i32.store8 offset=36
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988396
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988416
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988420
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1988404
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1988408
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988416
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988268
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988424
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1988404
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988268
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988428
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988432
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1988436
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1988440
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988428
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988444
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988448
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988280
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988304
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988452
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988444
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 0
                    call $GameController_TimeTravel
                    br 7 (;@1;)
                  end
                  i32.const 1955484
                  i32.load
                  local.tee 1
                  i32.load16_s offset=186
                  i32.const 512
                  i32.and
                  if  ;; label = @8
                    local.get 1
                    i32.load offset=116
                    i32.eqz
                    if  ;; label = @9
                      local.get 1
                      call $f33424
                    end
                  end
                  i32.const 1988188
                  i32.load
                  i32.const 0
                  call $f23889
                  local.get 0
                  i32.const 0
                  call $GameController_GotoMapa
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1987892
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const -64
                  i32.sub
                  i32.load
                  i32.const 5
                  i32.eq
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988088
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988456
                    i32.load
                    i32.store
                  end
                  local.get 0
                  i32.const -64
                  i32.sub
                  i32.load
                  i32.const 5
                  i32.ne
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988088
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1988460
                    i32.load
                    i32.store
                  end
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988208
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988184
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988464
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988468
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1988472
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988288
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 100
                  i32.add
                  i32.const 1988476
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 1
                  i32.store8 offset=26
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  local.get 0
                  i32.load offset=100
                  i32.const 0
                  call $f31869
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988184
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988376
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988480
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988484
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1988488
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988492
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 100
                  i32.add
                  i32.const 1988496
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  local.get 0
                  i32.load offset=100
                  i32.const 0
                  call $f31869
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988376
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988396
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988500
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988504
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1988508
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988512
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 100
                  i32.add
                  i32.const 1988516
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  local.get 0
                  i32.load offset=100
                  i32.const 0
                  call $f31869
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988396
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988268
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988520
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988524
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988396
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988528
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988532
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1988536
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988512
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 100
                  i32.add
                  i32.const 1988516
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  local.get 0
                  i32.load offset=100
                  i32.const 0
                  call $f31869
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988540
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988544
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988548
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988328
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988332
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988552
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988556
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988560
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988564
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                i32.const 1955484
                i32.load
                local.tee 1
                i32.load16_s offset=186
                i32.const 512
                i32.and
                if  ;; label = @7
                  local.get 1
                  i32.load offset=116
                  i32.eqz
                  if  ;; label = @8
                    local.get 1
                    call $f33424
                  end
                end
                i32.const 1988188
                i32.load
                i32.const 0
                call $f23889
                local.get 0
                i32.const 0
                call $GameController_GotoMapa
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load8_s offset=36
              i32.const 0
              i32.ne
              i32.const 1
              i32.xor
              i32.and
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988088
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988568
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988572
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988576
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=49
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988580
                  i32.load
                  i32.store
                end
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load8_s offset=22
              i32.const 0
              i32.ne
              i32.and
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988160
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988568
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988584
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988576
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=49
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988580
                  i32.load
                  i32.store
                end
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988160
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load8_s offset=36
              i32.const 0
              i32.ne
              local.set 2
              local.get 0
              i32.load offset=80
              i32.const 1988316
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load offset=80
              i32.const 1988524
              i32.load
              i32.const 0
              call $f26893
              i32.or
              local.get 2
              i32.const 1
              i32.xor
              i32.and
              i32.or
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988164
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988588
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988592
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988596
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988088
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load8_s offset=36
              i32.const 0
              i32.ne
              local.set 2
              local.get 0
              i32.load offset=80
              i32.const 1988308
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load offset=80
              i32.const 1988320
              i32.load
              i32.const 0
              call $f26893
              i32.or
              local.get 2
              i32.const 1
              i32.xor
              i32.and
              i32.or
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988184
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988600
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=45
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988604
                  i32.load
                  i32.store
                end
                local.get 0
                i32.const 1
                i32.store8 offset=45
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988608
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1988612
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1988616
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988184
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988376
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988620
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988624
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988628
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1988632
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1988636
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988376
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988396
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988640
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988644
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988648
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1988652
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988396
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.load offset=80
              i32.const 1988444
              i32.load
              i32.const 0
              call $f26893
              i32.or
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988276
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988656
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988612
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988616
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988276
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988280
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988660
                i32.load
                i32.store
                local.get 0
                i32.const 1
                i32.store8 offset=21
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988160
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988348
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988664
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988668
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988348
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988540
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988380
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988384
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988388
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=36
                if  ;; label = @7
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1988392
                  i32.load
                  i32.store
                end
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988540
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988544
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988672
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988404
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988544
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988328
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988676
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988680
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988328
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988332
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988684
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988688
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988692
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988332
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988696
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988700
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988696
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 0
                call $GameController_TimeTravel
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988560
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988704
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988708
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988304
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988712
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=36
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988316
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988716
                  i32.load
                  i32.store
                else
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988308
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988720
                  i32.load
                  i32.store
                end
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988164
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988556
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1988724
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988556
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 0
                call $GameController_TimeTravel
                br 5 (;@1;)
              end
              block  ;; label = @6
                i32.const 1955484
                i32.load
                local.tee 1
                i32.load16_s offset=186
                i32.const 512
                i32.and
                if  ;; label = @7
                  local.get 1
                  i32.load offset=116
                  br_if 1 (;@6;)
                  local.get 1
                  call $f33424
                end
              end
              i32.const 1988188
              i32.load
              i32.const 0
              call $f23889
              local.get 0
              i32.const 0
              call $GameController_GotoMapa
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1987892
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load8_s offset=41
            i32.const 0
            i32.ne
            i32.const 1
            i32.xor
            i32.and
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988088
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988728
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988732
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988736
              i32.load
              i32.store
              local.get 0
              i32.const 96
              i32.add
              i32.const 1988740
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              local.get 0
              i32.load offset=96
              i32.const 0
              call $f31876
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
            end
            local.get 0
            i32.load offset=80
            i32.const 1987892
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load8_s offset=41
            i32.const 0
            i32.ne
            i32.and
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988276
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988744
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988748
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988028
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1987892
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988752
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988756
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988760
              i32.load
              i32.store
              local.get 0
              i32.const 96
              i32.add
              i32.const 1988764
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              local.get 0
              i32.load offset=96
              i32.const 0
              call $f31876
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988088
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988160
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988768
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988556
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988208
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988772
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988376
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988776
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988780
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988784
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988776
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988396
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988788
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988296
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load offset=80
            i32.const 1988276
            i32.load
            i32.const 0
            call $f26893
            i32.or
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988304
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988792
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988796
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988800
              i32.load
              i32.store
              local.get 0
              i32.const 96
              i32.add
              i32.const 1988804
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              local.get 0
              i32.load offset=96
              i32.const 0
              call $f31876
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988304
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988308
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988808
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988812
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=38
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988308
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load offset=80
            i32.const 1988316
            i32.load
            i32.const 0
            call $f26893
            i32.or
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988320
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988816
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988820
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988824
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              i32.const 0
              call $f31891
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988320
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988524
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988828
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=30
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988428
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988444
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988832
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988184
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988836
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988840
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            i32.const 1955484
            i32.load
            local.tee 1
            i32.load16_s offset=186
            i32.const 512
            i32.and
            if  ;; label = @5
              local.get 1
              i32.load offset=116
              i32.eqz
              if  ;; label = @6
                local.get 1
                call $f33424
              end
            end
            i32.const 1988188
            i32.load
            i32.const 0
            call $f23889
            local.get 0
            i32.const 0
            call $GameController_GotoMapa
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1987892
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988088
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988844
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.tee 1
            i32.const 1
            i32.store8 offset=57
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988848
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988160
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988852
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988160
          i32.load
          i32.const 0
          call $f26893
          local.get 0
          i32.load offset=80
          i32.const 1988556
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988208
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988184
          i32.load
          i32.const 0
          call $f26893
          i32.or
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988376
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988856
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988164
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988208
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988860
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988376
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 0
            call $GameController_GotoMapa
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988396
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988268
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988864
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1988868
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1988872
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            i32.const 0
            call $f31891
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988268
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988428
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988876
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988276
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988280
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988880
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            local.get 0
            i32.const 1
            i32.store8 offset=27
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988308
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988316
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988884
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988328
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988332
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988888
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988428
          i32.load
          i32.const 0
          call $f26893
          local.get 0
          i32.load offset=80
          i32.const 1988444
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988276
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988280
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988296
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988304
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988308
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988316
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=80
          i32.const 1988320
          i32.load
          i32.const 0
          call $f26893
          i32.or
          if  ;; label = @4
            local.get 0
            i32.const -64
            i32.sub
            i32.load
            i32.const 5
            i32.eq
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988348
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988892
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.const -64
            i32.sub
            i32.load
            i32.const 4
            i32.ne
            br_if 3 (;@1;)
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988540
            i32.load
            i32.store
            local.get 0
            i32.const 1
            i32.store8 offset=12
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988896
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
          else
            i32.const 1955484
            i32.load
            local.tee 1
            i32.load16_s offset=186
            i32.const 512
            i32.and
            if  ;; label = @5
              local.get 1
              i32.load offset=116
              i32.eqz
              if  ;; label = @6
                local.get 1
                call $f33424
              end
            end
            i32.const 1988188
            i32.load
            i32.const 0
            call $f23889
            local.get 0
            i32.const 0
            call $GameController_GotoMapa
          end
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1987892
        i32.load
        i32.const 0
        call $f26893
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 4
        i32.lt_s
        i32.and
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988088
          i32.load
          i32.store
          local.get 0
          i32.const -64
          i32.sub
          i32.load
          i32.const 3
          i32.eq
          if  ;; label = @4
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988900
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
          else
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988904
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1988908
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1988912
            i32.load
            i32.store
            local.get 0
            i32.load8_s offset=28
            if  ;; label = @5
              local.get 0
              i32.const 96
              i32.add
              i32.const 1988916
              i32.load
              i32.store
            end
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
          end
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988088
        i32.load
        i32.const 0
        call $f26893
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 3
        i32.eq
        i32.and
        if  ;; label = @3
          local.get 0
          i32.const 0
          call $GameController_GotoMapa
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1987892
        i32.load
        i32.const 0
        call $f26893
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 3
        i32.gt_s
        i32.and
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988164
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988920
          i32.load
          i32.store
          local.get 0
          i32.load offset=84
          local.set 1
          local.get 0
          i32.load8_s offset=48
          if  ;; label = @4
            local.get 0
            i32.const 84
            i32.add
            local.get 1
            i32.const 1988928
            i32.load
            i32.const 0
            call $f26888
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1988932
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1988936
            i32.load
            i32.store
            local.get 0
            i32.const 96
            i32.add
            i32.const 1988940
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
          else
            local.get 0
            i32.const 84
            i32.add
            local.get 1
            i32.const 1988924
            i32.load
            i32.const 0
            call $f26888
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
          end
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988164
        i32.load
        i32.const 0
        call $f26893
        local.get 0
        i32.const -64
        i32.sub
        i32.load
        i32.const 3
        i32.gt_s
        i32.and
        local.get 0
        i32.load8_s offset=48
        i32.const 0
        i32.ne
        i32.const 1
        i32.xor
        i32.and
        if  ;; label = @3
          local.get 0
          i32.const 0
          call $GameController_GotoMapa
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988556
        i32.load
        i32.const 0
        call $f26893
        local.set 2
        local.get 0
        i32.load8_s offset=27
        if (result i32)  ;; label = @3
          local.get 0
          i32.load8_s offset=28
          if (result i32)  ;; label = @4
            local.get 0
            i32.const -64
            i32.sub
            i32.load
            i32.const 1
            i32.ne
          else
            i32.const 1
          end
        else
          i32.const 1
        end
        local.get 2
        i32.const 1
        i32.and
        i32.and
        if  ;; label = @3
          local.get 0
          i32.const 0
          call $GameController_GotoMapa
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988088
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988396
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988944
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988268
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988428
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988948
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988164
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988704
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988952
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988704
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988956
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988960
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1988964
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1988968
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          i32.const 0
          call $f31891
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988956
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988972
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988976
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1988980
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1988984
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          i32.const 0
          call $f31891
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988972
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988988
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1988992
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988996
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1989000
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989004
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1989008
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1989012
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989016
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1989012
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1989020
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989024
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          local.get 0
          i32.const 1
          i32.store8 offset=19
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1989020
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1989028
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989032
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1989036
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1989040
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989044
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988556
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988184
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989048
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989052
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989056
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          i32.const 0
          call $f31891
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988184
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988280
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989060
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988280
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988296
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989064
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988376
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988308
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989068
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988316
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988316
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989064
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988348
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988540
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989072
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989076
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989080
          i32.load
          i32.store
          local.get 0
          i32.const 96
          i32.add
          i32.const 1989084
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31876
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988540
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988544
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989088
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988328
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988696
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989092
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988228
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988560
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989096
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          local.get 0
          i32.const 1
          i32.store8 offset=48
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1989100
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 0
          call $GameController_TimeTravel
          br 2 (;@1;)
        end
        block  ;; label = @3
          i32.const 1955484
          i32.load
          local.tee 1
          i32.load16_s offset=186
          i32.const 512
          i32.and
          if  ;; label = @4
            local.get 1
            i32.load offset=116
            br_if 1 (;@3;)
            local.get 1
            call $f33424
          end
        end
        i32.const 1988188
        i32.load
        i32.const 0
        call $f23889
        local.get 0
        i32.const 0
        call $GameController_GotoMapa
        br 1 (;@1;)
      end
      i32.const 1955484
      i32.load
      local.tee 1
      i32.load16_s offset=186
      i32.const 512
      i32.and
      if  ;; label = @2
        local.get 1
        i32.load offset=116
        i32.eqz
        if  ;; label = @3
          local.get 1
          call $f33424
        end
      end
      i32.const 1989104
      i32.load
      i32.const 0
      call $f23889
      local.get 0
      i32.const 0
      call $GameController_GotoMapa
    end)

 (export "GameController_Option1" (func $GameController_Option1))
  (func $GameController_Option2 (param i32 i32)
    (local i32 i32 i32 i32 i32)
    i32.const 2496713
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358852
      i32.load
      call $f34102
      i32.const 2496713
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    i32.const 1989108
    i32.load
    local.get 0
    i32.load offset=80
    i32.const 0
    call $f26888
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    call $f23889
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 0
                      i32.load offset=76
                      i32.const 1
                      i32.sub
                      br_table 0 (;@9;) 1 (;@8;) 2 (;@7;) 3 (;@6;) 4 (;@5;) 5 (;@4;) 6 (;@3;) 7 (;@2;) 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1987892
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988160
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1989112
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 88
                      i32.add
                      i32.const 1989116
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 92
                      i32.add
                      i32.const 1989120
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=88
                      local.get 0
                      i32.load offset=92
                      i32.const 0
                      call $f31891
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988160
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988556
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1989124
                      i32.load
                      i32.store
                      local.get 0
                      i32.const -64
                      i32.sub
                      i32.load
                      i32.const 1
                      i32.eq
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1989128
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.const -64
                      i32.sub
                      i32.load
                      i32.const 2
                      i32.eq
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1989132
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.const -64
                      i32.sub
                      i32.load
                      i32.const 3
                      i32.eq
                      local.get 0
                      i32.const -64
                      i32.sub
                      i32.load
                      i32.const 4
                      i32.eq
                      i32.or
                      if  ;; label = @10
                        local.get 0
                        i32.const 84
                        i32.add
                        local.get 0
                        i32.load offset=84
                        i32.const 1989136
                        i32.load
                        i32.const 0
                        call $f26888
                        i32.store
                      end
                      local.get 0
                      i32.const -64
                      i32.sub
                      i32.load
                      i32.const 5
                      i32.eq
                      if  ;; label = @10
                        local.get 0
                        i32.load8_s offset=32
                        i32.eqz
                        if  ;; label = @11
                          local.get 0
                          i32.const 84
                          i32.add
                          local.get 0
                          i32.load offset=84
                          i32.const 1989140
                          i32.load
                          i32.const 0
                          call $f26888
                          i32.store
                        end
                        local.get 0
                        i32.load8_s offset=32
                        if  ;; label = @11
                          local.get 0
                          i32.const 84
                          i32.add
                          local.get 0
                          i32.load offset=84
                          i32.const 1989144
                          i32.load
                          i32.const 0
                          call $f26888
                          i32.store
                          local.get 0
                          i32.const 1
                          i32.store8 offset=24
                        end
                      end
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                    end
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1987892
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988328
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989148
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1989152
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1989156
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988088
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988164
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 1
                    i32.store8 offset=31
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989160
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988208
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988376
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989164
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988184
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988428
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989168
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 1
                    i32.store8 offset=22
                    local.get 0
                    i32.const 1
                    i32.store8 offset=36
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988276
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988540
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989172
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988280
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988304
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989176
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1989180
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1989184
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    i32.const 0
                    call $f31891
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988304
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988316
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989188
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 88
                    i32.add
                    i32.const 1989192
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 92
                    i32.add
                    i32.const 1989196
                    i32.load
                    i32.store
                    local.get 0
                    i32.load8_s offset=31
                    if  ;; label = @9
                      local.get 0
                      i32.const 96
                      i32.add
                      i32.const 1989200
                      i32.load
                      i32.store
                    end
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=88
                    local.get 0
                    i32.load offset=92
                    local.get 0
                    i32.load offset=96
                    i32.const 0
                    call $f31876
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988316
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988524
                    i32.load
                    i32.store
                    i32.const 1989204
                    i32.load
                    local.set 2
                    i32.const 1989208
                    i32.load
                    local.set 3
                    i32.const 1989212
                    i32.load
                    local.set 4
                    local.get 0
                    i32.load offset=68
                    i32.const 2
                    i32.lt_s
                    if  ;; label = @9
                      local.get 0
                      i32.const 84
                      i32.add
                      local.get 2
                      local.get 3
                      local.get 4
                      i32.const 0
                      call $f26874
                      i32.store
                    else
                      i32.const 1989216
                      i32.load
                      local.set 5
                      i32.const 1989220
                      i32.load
                      local.set 6
                      i32.const 1951464
                      i32.load
                      i32.const 5
                      call $f32880
                      local.tee 1
                      local.get 2
                      call $f15638
                      local.get 1
                      i32.const 16
                      i32.add
                      local.get 2
                      i32.store
                      local.get 1
                      local.get 5
                      call $f15638
                      local.get 1
                      i32.const 20
                      i32.add
                      local.get 5
                      i32.store
                      local.get 1
                      local.get 3
                      call $f15638
                      local.get 1
                      i32.const 24
                      i32.add
                      local.get 3
                      i32.store
                      local.get 1
                      local.get 6
                      call $f15638
                      local.get 1
                      i32.const 28
                      i32.add
                      local.get 6
                      i32.store
                      local.get 1
                      local.get 4
                      call $f15638
                      local.get 1
                      i32.const 32
                      i32.add
                      local.get 4
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      local.get 1
                      i32.const 0
                      call $f27066
                      i32.store
                    end
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                  else
                    local.get 0
                    i32.load offset=80
                    i32.const 1988328
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988696
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1989224
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                      br 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1988184
                    i32.load
                    i32.const 0
                    call $f26893
                    local.get 0
                    i32.load offset=80
                    i32.const 1988268
                    i32.load
                    i32.const 0
                    call $f26893
                    i32.or
                    local.get 0
                    i32.load offset=80
                    i32.const 1988396
                    i32.load
                    i32.const 0
                    call $f26893
                    i32.or
                    local.get 0
                    i32.load offset=80
                    i32.const 1988416
                    i32.load
                    i32.const 0
                    call $f26893
                    i32.or
                    i32.eqz
                    br_if 7 (;@1;)
                    local.get 0
                    i32.const 0
                    call $GameController_GotoCasa
                  end
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1987892
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988160
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989228
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1989232
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1989236
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1989240
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  i32.const 0
                  call $f31876
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988160
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988556
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989244
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  local.get 0
                  i32.const 1
                  i32.store8 offset=37
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988376
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988280
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989248
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1989252
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 92
                  i32.add
                  i32.const 1989256
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1989260
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  local.get 0
                  i32.load offset=96
                  i32.const 0
                  call $f31876
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988428
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988276
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1988420
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988280
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988308
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989264
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                end
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988160
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989268
                i32.load
                i32.store
                local.get 0
                i32.const 1
                i32.store8 offset=14
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988396
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988428
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989272
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988376
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988376
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989276
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988484
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1988492
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1988496
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988184
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988184
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989280
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989284
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1989288
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988208
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988524
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989292
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989296
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1989300
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988524
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988540
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989304
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989308
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1989312
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988556
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988556
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989316
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989320
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=38
                if  ;; label = @7
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1989324
                  i32.load
                  i32.store
                end
                local.get 0
                i32.const 100
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988540
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988328
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989328
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989332
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1989336
                i32.load
                i32.store
                local.get 0
                i32.const 1
                i32.store8 offset=26
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988328
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988696
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989340
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989344
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=88
                i32.const 0
                call $f31891
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988696
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1989348
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989352
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988556
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988556
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989356
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1989360
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=38
                if  ;; label = @7
                  local.get 0
                  i32.const 96
                  i32.add
                  i32.const 1989364
                  i32.load
                  i32.store
                end
                local.get 0
                i32.const 100
                i32.add
                i32.const 1976112
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                i32.const 0
                call $f31876
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
              end
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988088
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load offset=80
            i32.const 1988160
            i32.load
            i32.const 0
            call $f26893
            i32.or
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988304
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989368
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1989372
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1989376
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              i32.const 0
              call $f31891
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988184
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988276
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988656
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988612
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988616
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              i32.const 0
              call $f31891
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988376
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988268
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989380
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=21
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988396
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load offset=80
            i32.const 1988444
            i32.load
            i32.const 0
            call $f26893
            i32.or
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988280
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988660
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=21
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1987892
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988328
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988676
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988680
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988408
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              i32.const 0
              call $f31891
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988276
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988296
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989384
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988540
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988560
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989388
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1989392
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1989396
              i32.load
              i32.store
              local.get 0
              i32.const 96
              i32.add
              i32.const 1989400
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              local.get 0
              i32.load offset=96
              i32.const 0
              call $f31876
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988332
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988228
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989404
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988560
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1989100
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989408
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988304
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989412
              i32.load
              i32.store
              local.get 0
              i32.load8_s offset=36
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988524
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988716
                i32.load
                i32.store
              else
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988320
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988720
                i32.load
                i32.store
              end
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988164
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988208
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989416
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=46
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            i32.const 1955484
            i32.load
            local.tee 1
            i32.load16_s offset=186
            i32.const 512
            i32.and
            if  ;; label = @5
              local.get 1
              i32.load offset=116
              i32.eqz
              if  ;; label = @6
                local.get 1
                call $f33424
              end
            end
            i32.const 1988188
            i32.load
            i32.const 0
            call $f23889
            local.get 0
            i32.const 0
            call $GameController_GotoMapa
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1987892
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988268
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989420
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.tee 1
            i32.const 1
            i32.store8 offset=57
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988088
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988164
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989424
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988556
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988184
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989428
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988304
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988316
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989432
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989436
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988320
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988348
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1988828
            i32.load
            i32.store
            local.get 0
            i32.const 1
            i32.store8 offset=30
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
          end
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1987892
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988396
          i32.load
          i32.store
          local.get 0
          i32.load8_s offset=39
          if  ;; label = @4
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989444
            i32.load
            i32.store
          else
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989440
            i32.load
            i32.store
          end
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989448
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989452
          i32.load
          i32.store
          local.get 0
          i32.const 96
          i32.add
          i32.const 1989456
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31876
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988848
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988164
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989460
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989464
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989468
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          i32.const 0
          call $f31891
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988164
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988184
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989472
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988396
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988276
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989476
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989480
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989484
          i32.load
          i32.store
          local.get 0
          i32.const 96
          i32.add
          i32.const 1989488
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31876
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988268
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988444
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989492
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988276
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988296
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989496
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988308
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988320
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989500
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988328
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988696
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989504
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
        end
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1987892
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988556
        i32.load
        i32.store
        block  ;; label = @3
          block  ;; label = @4
            local.get 0
            i32.load8_s offset=27
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.load8_s offset=28
            i32.eqz
            br_if 0 (;@4;)
            local.get 0
            i32.const -64
            i32.sub
            i32.load
            i32.const 1
            i32.ne
            br_if 0 (;@4;)
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989512
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989516
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989520
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            i32.const 0
            call $f31891
            br 1 (;@3;)
          end
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989508
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
        end
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988088
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988268
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989524
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1989528
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988164
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1989100
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989532
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988956
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1989036
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989536
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1989540
        i32.load
        i32.store
        local.get 0
        i32.const 92
        i32.add
        i32.const 1989544
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        local.get 0
        i32.load offset=92
        i32.const 0
        call $f31891
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988972
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988996
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989548
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1989552
        i32.load
        i32.store
        local.get 0
        i32.const 92
        i32.add
        i32.const 1989556
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        local.get 0
        i32.load offset=92
        i32.const 0
        call $f31891
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988996
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1989008
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989560
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1989036
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1989564
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989568
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988556
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988376
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989572
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1989576
        i32.load
        i32.store
        local.get 0
        i32.const 92
        i32.add
        i32.const 1989580
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        local.get 0
        i32.load offset=92
        i32.const 0
        call $f31891
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988184
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988304
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989584
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988376
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988320
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989588
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.tee 1
        i32.const 1
        i32.store8 offset=57
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988540
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988328
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989592
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1989596
        i32.load
        i32.store
        local.get 0
        i32.const 92
        i32.add
        i32.const 1989600
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        local.get 0
        i32.load offset=92
        i32.const 0
        call $f31891
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988328
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988228
        i32.load
        i32.store
        local.get 0
        i32.const 88
        i32.add
        i32.const 1976876
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989604
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=88
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
      end
    end)

 (export "GameController_Option2" (func $GameController_Option2))
  (func $GameController_Option3 (param i32 i32)
    (local i32)
    i32.const 2496714
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358856
      i32.load
      call $f34102
      i32.const 2496714
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    i32.const 1989608
    i32.load
    local.get 0
    i32.load offset=80
    i32.const 0
    call $f26888
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    call $f23889
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 0
                      i32.load offset=76
                      i32.const 1
                      i32.sub
                      br_table 0 (;@9;) 1 (;@8;) 2 (;@7;) 3 (;@6;) 4 (;@5;) 5 (;@4;) 6 (;@3;) 7 (;@2;) 8 (;@1;)
                    end
                    local.get 0
                    i32.load offset=80
                    i32.const 1987892
                    i32.load
                    i32.const 0
                    call $f26893
                    if  ;; label = @9
                      local.get 0
                      i32.const 80
                      i32.add
                      i32.const 1988208
                      i32.load
                      i32.store
                      local.get 0
                      i32.const 84
                      i32.add
                      i32.const 1989612
                      i32.load
                      i32.store
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=72
                      i32.const 0
                      call $f31879
                      local.get 0
                      i32.load offset=52
                      local.get 0
                      i32.load offset=84
                      i32.const 0
                      call $f31890
                    end
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1987892
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988560
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989616
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988088
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988556
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989620
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 1
                    i32.store8 offset=31
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988208
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988396
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989624
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988276
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988544
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989628
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 1
                    i32.store8 offset=15
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    br 7 (;@1;)
                  end
                  local.get 0
                  i32.load offset=80
                  i32.const 1988316
                  i32.load
                  i32.const 0
                  call $f26893
                  if  ;; label = @8
                    local.get 0
                    i32.const 80
                    i32.add
                    i32.const 1988348
                    i32.load
                    i32.store
                    local.get 0
                    i32.const 84
                    i32.add
                    i32.const 1989632
                    i32.load
                    i32.store
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=72
                    i32.const 0
                    call $f31879
                    local.get 0
                    i32.load offset=52
                    local.get 0
                    i32.load offset=84
                    i32.const 0
                    call $f31890
                    local.get 0
                    i32.const 0
                    i32.store8 offset=31
                  end
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1987892
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988184
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989636
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 88
                  i32.add
                  i32.const 1988668
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=88
                  local.get 0
                  i32.load offset=92
                  i32.const 0
                  call $f31891
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988160
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988208
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989640
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 1
                  i32.store8 offset=38
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=80
                i32.const 1988280
                i32.load
                i32.const 0
                call $f26893
                if  ;; label = @7
                  local.get 0
                  i32.const 80
                  i32.add
                  i32.const 1988296
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989644
                  i32.load
                  i32.store
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=72
                  i32.const 0
                  call $f31879
                  local.get 0
                  i32.load offset=52
                  local.get 0
                  i32.load offset=84
                  i32.const 0
                  call $f31890
                end
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988164
                i32.load
                i32.store
                local.get 0
                i32.load8_s offset=36
                if  ;; label = @7
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989648
                  i32.load
                  i32.store
                  local.get 0
                  i32.const 0
                  i32.store8 offset=36
                else
                  local.get 0
                  i32.const 84
                  i32.add
                  i32.const 1989652
                  i32.load
                  i32.store
                end
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988396
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988444
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989656
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988376
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988396
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989660
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988532
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988536
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1989664
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1988516
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988184
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988376
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989668
                i32.load
                i32.store
                local.get 0
                i32.const 88
                i32.add
                i32.const 1988484
                i32.load
                i32.store
                local.get 0
                i32.const 92
                i32.add
                i32.const 1988488
                i32.load
                i32.store
                local.get 0
                i32.const 96
                i32.add
                i32.const 1988492
                i32.load
                i32.store
                local.get 0
                i32.const 100
                i32.add
                i32.const 1988496
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=88
                local.get 0
                i32.load offset=92
                local.get 0
                i32.load offset=96
                local.get 0
                i32.load offset=100
                i32.const 0
                call $f31869
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988556
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1989672
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989676
                i32.load
                i32.store
                local.get 0
                i32.const 1
                i32.store8 offset=44
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              i32.const 1955484
              i32.load
              local.tee 1
              i32.load16_s offset=186
              i32.const 512
              i32.and
              if  ;; label = @6
                local.get 1
                i32.load offset=116
                i32.eqz
                if  ;; label = @7
                  local.get 1
                  call $f33424
                end
              end
              i32.const 1988188
              i32.load
              i32.const 0
              call $f23889
              local.get 0
              i32.const 0
              call $GameController_GotoMapa
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988088
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988348
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989680
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1989684
              i32.load
              i32.store
              local.get 0
              i32.const 92
              i32.add
              i32.const 1988408
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              local.get 0
              i32.load offset=92
              i32.const 0
              call $f31891
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988184
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988280
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1988660
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=21
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988376
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988428
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989688
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988396
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.load offset=80
            i32.const 1988444
            i32.load
            i32.const 0
            call $f26893
            i32.or
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988296
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989384
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988540
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988956
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989692
              i32.load
              i32.store
              local.get 0
              i32.const 1
              i32.store8 offset=23
              local.get 0
              i32.const 0
              i32.store8 offset=36
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1988560
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1989696
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989700
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
            end
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1987892
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988428
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989704
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988088
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988556
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989708
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989712
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989716
            i32.load
            i32.store
            local.get 0
            i32.load8_s offset=27
            if  ;; label = @5
              local.get 0
              i32.const 96
              i32.add
              i32.const 1989720
              i32.load
              i32.store
            end
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988556
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988376
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989724
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31879
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988304
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988328
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989728
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1988820
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989732
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            i32.const 0
            call $f31891
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
          end
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1987892
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988328
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989736
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989740
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989744
          i32.load
          i32.store
          local.get 0
          i32.load8_s offset=13
          if  ;; label = @4
            local.get 0
            i32.const 96
            i32.add
            i32.const 1989748
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
          else
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            i32.const 0
            call $f31891
          end
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988848
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988556
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989752
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988396
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988308
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989756
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989760
          i32.load
          i32.store
          local.get 0
          i32.load8_s offset=42
          if  ;; label = @4
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989764
            i32.load
            i32.store
          end
          local.get 0
          i32.load8_s offset=42
          i32.const 0
          i32.ne
          local.get 0
          i32.load8_s offset=12
          i32.const 0
          i32.ne
          i32.and
          local.get 0
          i32.const -64
          i32.sub
          i32.load
          i32.const 4
          i32.eq
          i32.and
          if  ;; label = @4
            local.get 0
            i32.const 96
            i32.add
            i32.const 1989768
            i32.load
            i32.store
          end
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31876
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988276
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988304
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989772
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988308
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988524
          i32.load
          i32.store
          local.get 0
          i32.const 1
          i32.store8 offset=41
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989776
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988328
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988228
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989780
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          local.get 0
          i32.const 1
          i32.store8 offset=42
        end
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1987892
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988276
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989784
        i32.load
        i32.store
        local.get 0
        i32.const 1
        i32.store8 offset=28
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988088
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988444
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989788
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988164
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1989696
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989792
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988540
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988332
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989796
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
      end
    end)

 (export "GameController_Option3" (func $GameController_Option3))
  (func $GameController_Option4 (param i32 i32)
    (local i32 i32)
    i32.const 2496715
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358860
      i32.load
      call $f34102
      i32.const 2496715
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    local.get 0
    i32.const 100
    i32.add
    i32.const 1976112
    i32.load
    local.tee 1
    i32.store
    local.get 0
    i32.const 96
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 92
    i32.add
    local.get 1
    i32.store
    local.get 0
    i32.const 88
    i32.add
    local.get 1
    i32.store
    i32.const 1989800
    i32.load
    local.get 0
    i32.load offset=80
    i32.const 0
    call $f26888
    i32.const 1955484
    i32.load
    local.tee 1
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 1
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 1
        call $f33424
      end
    end
    i32.const 0
    call $f23889
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.load offset=76
                i32.const 1
                i32.sub
                br_table 0 (;@6;) 1 (;@5;) 2 (;@4;) 2 (;@4;) 3 (;@3;) 4 (;@2;) 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 80
                i32.add
                i32.const 1988184
                i32.load
                i32.store
                local.get 0
                i32.const 84
                i32.add
                i32.const 1989804
                i32.load
                i32.store
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=72
                i32.const 0
                call $f31879
                local.get 0
                i32.load offset=52
                local.get 0
                i32.load offset=84
                i32.const 0
                call $f31890
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=80
              i32.const 1988088
              i32.load
              i32.const 0
              call $f26893
              if  ;; label = @6
                local.get 0
                i32.const 0
                call $GameController_GotoMapa
              end
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=80
            i32.const 1987892
            i32.load
            i32.const 0
            call $f26893
            local.get 0
            i32.const -64
            i32.sub
            i32.load
            i32.const 4
            i32.lt_s
            i32.and
            i32.eqz
            if  ;; label = @5
              local.get 0
              i32.load offset=80
              i32.const 1987892
              i32.load
              i32.const 0
              call $f26893
              local.get 0
              i32.const -64
              i32.sub
              i32.load
              i32.const 3
              i32.gt_s
              i32.and
              i32.eqz
              br_if 4 (;@1;)
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988228
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989832
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=84
              i32.const 0
              call $f31890
              br 4 (;@1;)
            end
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988276
            i32.load
            i32.store
            i32.const 1989808
            i32.load
            local.set 1
            i32.const 1989812
            i32.load
            local.set 3
            i32.const 1989816
            i32.load
            local.set 2
            local.get 0
            i32.load8_s offset=14
            if  ;; label = @5
              local.get 0
              i32.const 84
              i32.add
              local.get 1
              local.get 3
              local.get 2
              i32.const 0
              call $f26874
              i32.store
            else
              local.get 0
              i32.const 84
              i32.add
              local.get 1
              local.get 2
              i32.const 0
              call $f26888
              i32.store
            end
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989820
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989824
            i32.load
            i32.store
            local.get 0
            i32.load8_s offset=14
            if  ;; label = @5
              local.get 0
              i32.const 96
              i32.add
              i32.const 1989828
              i32.load
              i32.store
            end
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1987892
          i32.load
          i32.const 0
          call $f26893
          local.get 0
          i32.const -64
          i32.sub
          i32.load
          i32.const 4
          i32.ne
          i32.and
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988556
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989836
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989320
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989840
            i32.load
            i32.store
            local.get 0
            i32.load8_s offset=38
            if  ;; label = @5
              local.get 0
              i32.const 96
              i32.add
              i32.const 1989324
              i32.load
              i32.store
            end
            local.get 0
            i32.const 100
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1987892
          i32.load
          i32.const 0
          call $f26893
          local.get 0
          i32.const -64
          i32.sub
          i32.load
          i32.const 4
          i32.eq
          i32.and
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988208
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989844
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989848
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989852
            i32.load
            i32.store
            local.get 0
            i32.const 96
            i32.add
            i32.const 1989840
            i32.load
            i32.store
            local.get 0
            i32.const 100
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988396
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988276
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989856
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.const 96
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.const 100
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            local.get 0
            i32.load offset=100
            i32.const 0
            call $f31869
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988376
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988376
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989860
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1988484
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1989864
            i32.load
            i32.store
            local.get 0
            i32.const 96
            i32.add
            i32.const 1988492
            i32.load
            i32.store
            local.get 0
            i32.const 100
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988184
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 0
            i32.const 80
            i32.add
            i32.const 1988184
            i32.load
            i32.store
            local.get 0
            i32.const 84
            i32.add
            i32.const 1989868
            i32.load
            i32.store
            local.get 0
            i32.const 88
            i32.add
            i32.const 1989872
            i32.load
            i32.store
            local.get 0
            i32.const 92
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.const 96
            i32.add
            i32.const 1989876
            i32.load
            i32.store
            local.get 0
            i32.const 100
            i32.add
            i32.const 1976112
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
          end
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988184
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988296
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989384
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=72
          i32.const 0
          call $f31879
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988376
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988444
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989880
          i32.load
          i32.store
          local.get 0
          i32.const 88
          i32.add
          i32.const 1988608
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1988612
          i32.load
          i32.store
          local.get 0
          i32.const 96
          i32.add
          i32.const 1988616
          i32.load
          i32.store
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=88
          local.get 0
          i32.load offset=92
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31876
          local.get 0
          i32.load offset=52
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31890
        end
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1987892
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 0
        i32.const 80
        i32.add
        i32.const 1988428
        i32.load
        i32.store
        local.get 0
        i32.const 84
        i32.add
        i32.const 1989704
        i32.load
        i32.store
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
      end
    end)

 (export "GameController_Option4" (func $GameController_Option4))
  (func $GameController_TextOption (param i32 i32 i32)
    (local i32)
    i32.const 2496716
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358872
      i32.load
      call $f34102
      i32.const 2496716
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 2
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 2
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 2
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31839
    i32.const 1989884
    i32.load
    local.get 1
    i32.const 0
    call $f26888
    i32.const 1955484
    i32.load
    local.tee 2
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 2
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 2
        call $f33424
      end
    end
    i32.const 0
    call $f23889
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 0
            i32.load offset=76
            i32.const 6
            i32.sub
            br_table 0 (;@4;) 1 (;@3;) 2 (;@2;) 3 (;@1;)
          end
          local.get 0
          i32.load offset=80
          i32.const 1988268
          i32.load
          i32.const 0
          call $f26893
          if  ;; label = @4
            local.get 1
            i32.const 1989888
            i32.load
            i32.const 0
            call $f26893
            if  ;; label = @5
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988296
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989892
              i32.load
              i32.store
              local.get 0
              i32.const 88
              i32.add
              i32.const 1988748
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=88
              i32.const 0
              call $f31879
            else
              local.get 0
              i32.const 80
              i32.add
              i32.const 1988280
              i32.load
              i32.store
              local.get 0
              i32.const 84
              i32.add
              i32.const 1989896
              i32.load
              i32.store
              local.get 0
              i32.load offset=52
              local.get 0
              i32.load offset=72
              i32.const 0
              call $f31879
            end
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=84
            i32.const 0
            call $f31890
            br 3 (;@1;)
          end
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=80
        i32.const 1988088
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988848
          i32.load
          i32.store
          local.get 1
          local.get 0
          i32.const 68
          i32.add
          i32.const 0
          call $f20604
          i32.const 0
          call $f26893
          if (result i32)  ;; label = @4
            i32.const 1989900
            i32.load
          else
            local.get 0
            i32.const 68
            i32.add
            i32.const 0
            call $f20604
            local.set 1
            i32.const 1989904
            i32.load
            local.get 1
            i32.const 1989908
            i32.load
            i32.const 0
            call $f26874
          end
          i32.const 1989912
          i32.load
          i32.const 0
          call $f26888
          local.set 1
          local.get 0
          i32.const 88
          i32.add
          i32.const 1989916
          i32.load
          i32.store
          local.get 0
          i32.const 92
          i32.add
          i32.const 1989920
          i32.load
          i32.store
          local.get 0
          i32.load offset=68
          i32.const 1
          i32.gt_s
          if  ;; label = @4
            local.get 0
            i32.const 96
            i32.add
            i32.const 1989924
            i32.load
            i32.store
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            local.get 0
            i32.load offset=96
            i32.const 0
            call $f31876
          else
            local.get 0
            i32.load offset=52
            local.get 0
            i32.load offset=88
            local.get 0
            i32.load offset=92
            i32.const 0
            call $f31891
          end
          local.get 0
          i32.load offset=52
          local.get 1
          i32.const 0
          call $f31890
        end
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=80
      i32.const 1988320
      i32.load
      i32.const 0
      call $f26893
      if  ;; label = @2
        local.get 1
        i32.const 1989928
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988348
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          i32.const 1989932
          i32.load
          i32.store
        else
          local.get 0
          i32.const 80
          i32.add
          i32.const 1988524
          i32.load
          i32.store
          i32.const 1951464
          i32.load
          i32.const 5
          call $f32880
          local.tee 2
          i32.const 1989936
          i32.load
          call $f15638
          local.get 2
          i32.const 16
          i32.add
          i32.const 1989936
          i32.load
          i32.store
          local.get 2
          local.get 1
          call $f15638
          local.get 2
          i32.const 20
          i32.add
          local.get 1
          i32.store
          local.get 2
          i32.const 1989940
          i32.load
          call $f15638
          local.get 2
          i32.const 24
          i32.add
          i32.const 1989940
          i32.load
          i32.store
          local.get 2
          local.get 1
          call $f15638
          local.get 2
          i32.const 28
          i32.add
          local.get 1
          i32.store
          local.get 2
          i32.const 1989944
          i32.load
          call $f15638
          local.get 2
          i32.const 32
          i32.add
          i32.const 1989944
          i32.load
          i32.store
          local.get 0
          i32.const 84
          i32.add
          local.get 2
          i32.const 0
          call $f27066
          i32.store
        end
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=72
        i32.const 0
        call $f31879
        local.get 0
        i32.load offset=52
        local.get 0
        i32.load offset=84
        i32.const 0
        call $f31890
      end
    end)

 (export "GameController_TextOption" (func $GameController_TextOption))
  (func $GameController_TimeTravel (param i32 i32)
    local.get 0
    i32.load offset=52
    i32.const 0
    call $f31885
    local.get 0
    local.get 0
    i32.load offset=68
    i32.const 1
    i32.add
    i32.store offset=68
    local.get 0
    i32.const -64
    i32.sub
    i32.const 1
    i32.store
    local.get 0
    i32.load offset=56
    local.get 0
    i32.load offset=68
    i32.const 0
    call $IntroManager_ShowIntro
    local.get 0
    i32.const 0
    call $f30625
    f32.const 0x1p-1 (;=0.5;)
    f32.gt
    i32.store8 offset=49)

 (export "GameController_TimeTravel" (func $GameController_TimeTravel))
  (func $GameController_ResetItems (param i32 i32)
    (local i32)
    i32.const 2496717
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358864
      i32.load
      call $f34102
      i32.const 2496717
      i32.const 1
      i32.store8
    end
    i32.const 1955484
    i32.load
    local.tee 2
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 2
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 2
        call $f33424
      end
    end
    i32.const 1989948
    i32.load
    i32.const 0
    call $f23889
    local.get 0
    i32.const 0
    i32.store8 offset=34
    local.get 0
    i32.const 0
    i32.store8 offset=33
    local.get 0
    i32.const 0
    i32.store8 offset=32
    local.get 0
    i32.const 0
    i32.store8 offset=31
    local.get 0
    i32.const 0
    i32.store8 offset=30
    local.get 0
    i32.const 0
    i32.store8 offset=29
    local.get 0
    i32.const 0
    i32.store8 offset=38
    local.get 0
    i32.const 0
    i32.store8 offset=36
    local.get 0
    i32.const 0
    i32.store8 offset=35
    local.get 0
    i32.const 0
    i32.store8 offset=42
    local.get 0
    i32.const 0
    i32.store8 offset=37
    local.get 0
    i32.const 0
    i32.store8 offset=41
    local.get 0
    i32.const 0
    i32.store8 offset=40
    local.get 0
    i32.const 0
    i32.store8 offset=39
    local.get 0
    i32.const 0
    i32.store8 offset=47
    local.get 0
    i32.const 0
    i32.store8 offset=46
    local.get 0
    i32.const 0
    i32.store8 offset=45
    local.get 0
    i32.const 0
    i32.store8 offset=44
    local.get 0
    i32.const 0
    i32.store8 offset=43
    local.get 0
    i32.const 0
    i32.store8 offset=48
    local.get 0
    i32.load offset=60
    i32.const 0
    call $f31888)

 (export "GameController_ResetItems" (func $GameController_ResetItems))
  (func $GameController_Constructorctor (param i32 i32)
    i32.const 2496718
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1358876
      i32.load
      call $f34102
      i32.const 2496718
      i32.const 1
      i32.store8
    end
    local.get 0
    i32.const 1
    i32.store offset=68
    local.get 0
    i32.const 72
    i32.add
    i32.const 1989952
    i32.load
    i32.store
    local.get 0
    i32.const 0
    call $f23815)

 (export "GameController_Constructorctor" (func $GameController_Constructorctor))
  (func $IntroManager_ShowIntro (param i32 i32 i32)
    (local i32)
    i32.const 2496693
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1361308
      i32.load
      call $f34102
      i32.const 2496693
      i32.const 1
      i32.store8
    end
    local.get 0
    i32.const 44
    i32.add
    i32.const 1976112
    i32.load
    i32.store
    local.get 0
    i32.const 0
    call $f31864
    i32.const 1956932
    i32.load
    local.tee 3
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 3
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 3
        call $f33424
      end
    end
    i32.const 0
    i32.const 0
    call $f31843
    local.get 0
    i32.load offset=32
    i32.const 1
    i32.const 0
    call $f24039
    local.get 1
    i32.const 1
    i32.gt_s
    if  ;; label = @1
      local.get 0
      i32.load offset=16
      i32.const 0
      call $f31865
    end
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 1
            i32.const 1
            i32.sub
            br_table 0 (;@4;) 1 (;@3;) 2 (;@2;)
          end
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989956
          i32.load
          i32.store
          local.get 0
          i32.load offset=20
          local.get 0
          i32.load offset=68
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.const 44
        i32.add
        i32.const 1989960
        i32.load
        i32.store
        local.get 0
        i32.load offset=20
        local.get 0
        i32.load offset=76
        i32.const 0
        call $f31866
        local.get 0
        i32.load offset=12
        i32.const 1
        i32.store8 offset=16
        br 1 (;@1;)
      end
      local.get 0
      i32.const 44
      i32.add
      i32.const 1989964
      i32.load
      i32.store
      local.get 0
      i32.load offset=20
      local.get 0
      i32.load offset=80
      i32.const 0
      call $f31866
    end
    local.get 0
    i32.const 1
    i32.store8 offset=40)

 (export "IntroManager_ShowIntro" (func $IntroManager_ShowIntro))
  (func $IntroManager_Next (param i32 i32)
    (local i32 i32)
    global.get $stack
    local.set 1
    global.get $stack
    i32.const 32
    i32.add
    global.set $stack
    i32.const 2496720
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1361304
      i32.load
      call $f34102
      i32.const 2496720
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 2
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 2
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 2
        call $f33424
      end
    end
    local.get 1
    i32.const 16
    i32.add
    local.set 2
    i32.const 0
    i32.const 0
    call $f31839
    block  ;; label = @1
      local.get 0
      i32.load offset=44
      i32.const 1989960
      i32.load
      i32.const 0
      call $f26893
      local.get 0
      i32.load offset=44
      i32.const 1989964
      i32.load
      i32.const 0
      call $f26893
      i32.or
      if  ;; label = @2
        local.get 0
        i32.load offset=20
        i32.const 0
        call $f31901
        local.get 0
        i32.load offset=24
        i32.const 0
        call $f31901
        local.get 0
        i32.const 0
        call $f31864
        local.get 0
        i32.load offset=12
        i32.load8_s offset=32
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989968
          i32.load
          i32.store
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=84
          i32.const 0
          call $f31866
          local.get 0
          i32.load offset=28
          local.set 3
          local.get 1
          i32.const 0
          call $f23834
          local.get 2
          local.get 1
          i64.load align=4
          i64.store align=4
          local.get 2
          local.get 1
          i64.load offset=8 align=4
          i64.store offset=8 align=4
          i32.const 23
          local.get 3
          local.get 2
          call $f16624
          local.get 0
          i32.load offset=28
          local.get 0
          i32.load offset=48
          i32.const 0
          call $f22860
          local.get 0
          i32.load offset=12
          i32.const 1
          i32.store8 offset=17
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=12
        i32.load8_s offset=44
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989972
          i32.load
          i32.store
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=92
          i32.const 0
          call $f31866
          local.get 0
          i32.load offset=28
          local.set 3
          local.get 1
          i32.const 0
          call $f23834
          local.get 2
          local.get 1
          i64.load align=4
          i64.store align=4
          local.get 2
          local.get 1
          i64.load offset=8 align=4
          i64.store offset=8 align=4
          i32.const 23
          local.get 3
          local.get 2
          call $f16624
          local.get 0
          i32.load offset=28
          local.get 0
          i32.load offset=52
          i32.const 0
          call $f22860
          local.get 0
          i32.load offset=12
          i32.const 1
          i32.store8 offset=18
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=12
        i32.load8_s offset=46
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989976
          i32.load
          i32.store
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=96
          i32.const 0
          call $f31866
          local.get 0
          i32.load offset=12
          i32.const 1
          i32.store8 offset=20
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=12
        i32.load8_s offset=19
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989984
          i32.load
          i32.store
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=116
          i32.const 0
          call $f31866
        else
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989980
          i32.load
          i32.store
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=104
          i32.const 0
          call $f31866
          local.get 0
          i32.load offset=12
          i32.const 1
          i32.store8 offset=20
        end
      else
        local.get 0
        i32.load offset=44
        i32.const 1989968
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989988
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=88
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1989976
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989992
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=28
          local.set 3
          local.get 1
          i32.const 0
          call $f23834
          local.get 2
          local.get 1
          i64.load align=4
          i64.store align=4
          local.get 2
          local.get 1
          i64.load offset=8 align=4
          i64.store offset=8 align=4
          i32.const 23
          local.get 3
          local.get 2
          call $f16624
          local.get 0
          i32.load offset=28
          local.get 0
          i32.load offset=56
          i32.const 0
          call $f22860
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=100
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1989980
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1989996
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=28
          local.set 3
          local.get 1
          i32.const 0
          call $f23834
          local.get 2
          local.get 1
          i64.load align=4
          i64.store align=4
          local.get 2
          local.get 1
          i64.load offset=8 align=4
          i64.store offset=8 align=4
          i32.const 23
          local.get 3
          local.get 2
          call $f16624
          local.get 0
          i32.load offset=28
          local.get 0
          i32.load offset=60
          i32.const 0
          call $f22860
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=108
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1989996
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1990000
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=112
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1989984
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1990004
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=28
          local.set 3
          local.get 1
          i32.const 0
          call $f23834
          local.get 2
          local.get 1
          i64.load align=4
          i64.store align=4
          local.get 2
          local.get 1
          i64.load offset=8 align=4
          i64.store offset=8 align=4
          i32.const 23
          local.get 3
          local.get 2
          call $f16624
          local.get 0
          i32.load offset=28
          local.get 0
          i32.const -64
          i32.sub
          i32.load
          i32.const 0
          call $f22860
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=120
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1990004
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1990008
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=124
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1990008
        i32.load
        i32.const 0
        call $f26893
        if  ;; label = @3
          local.get 0
          i32.const 44
          i32.add
          i32.const 1990012
          i32.load
          i32.store
          local.get 0
          i32.const 0
          call $f31864
          local.get 0
          i32.load offset=24
          i32.const 0
          call $f31901
          local.get 0
          i32.load offset=24
          local.get 0
          i32.load offset=128
          i32.const 0
          call $f31866
          br 2 (;@1;)
        end
        local.get 0
        i32.load offset=44
        i32.const 1990012
        i32.load
        i32.const 0
        call $f26893
        i32.eqz
        if  ;; label = @3
          local.get 0
          i32.load offset=44
          i32.const 1989968
          i32.load
          i32.const 0
          call $f26893
          local.get 0
          i32.load offset=44
          i32.const 1989988
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=44
          i32.const 1989972
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=44
          i32.const 1989976
          i32.load
          i32.const 0
          call $f26893
          i32.or
          local.get 0
          i32.load offset=44
          i32.const 1990000
          i32.load
          i32.const 0
          call $f26893
          i32.or
          if  ;; label = @4
            local.get 0
            i32.load offset=24
            i32.const 0
            call $f31901
            local.get 0
            i32.load offset=28
            local.set 3
            local.get 1
            i64.const 0
            i64.store align=4
            local.get 1
            i64.const 0
            i64.store offset=8 align=4
            local.get 1
            f32.const 0x0p+0 (;=0;)
            f32.store
            local.get 1
            f32.const 0x0p+0 (;=0;)
            f32.store offset=4
            local.get 1
            f32.const 0x0p+0 (;=0;)
            f32.store offset=8
            local.get 1
            f32.const 0x0p+0 (;=0;)
            f32.store offset=12
            local.get 2
            local.get 1
            i64.load align=4
            i64.store align=4
            local.get 2
            local.get 1
            i64.load offset=8 align=4
            i64.store offset=8 align=4
            i32.const 23
            local.get 3
            local.get 2
            call $f16624
            local.get 0
            i32.const 0
            call $f31864
            local.get 0
            i32.const 44
            i32.add
            i32.const 1990024
            i32.load
            i32.store
            local.get 0
            i32.load offset=20
            local.get 0
            i32.load offset=72
            i32.const 0
            call $f31866
          else
            local.get 0
            i32.const 0
            call $IntroManager_HideIntro
          end
          br 2 (;@1;)
        end
        i32.const 1955484
        i32.load
        local.tee 2
        i32.load16_s offset=186
        i32.const 512
        i32.and
        if  ;; label = @3
          local.get 2
          i32.load offset=116
          i32.eqz
          if  ;; label = @4
            local.get 2
            call $f33424
          end
        end
        i32.const 1990016
        i32.load
        i32.const 0
        call $f23889
        local.get 0
        i32.const 0
        call $f31864
        local.get 0
        i32.load offset=24
        i32.const 0
        call $f31901
        local.get 0
        i32.load offset=24
        i32.const 1990020
        i32.load
        i32.const 0
        call $f31866
      end
    end
    local.get 1
    global.set $stack)

 (export "IntroManager_Next" (func $IntroManager_Next))
  (func $IntroManager_HideIntro (param i32 i32)
    (local i32 i32)
    global.get $stack
    local.set 1
    global.get $stack
    i32.const 32
    i32.add
    global.set $stack
    i32.const 2496721
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1361300
      i32.load
      call $f34102
      i32.const 2496721
      i32.const 1
      i32.store8
    end
    i32.const 1956932
    i32.load
    local.tee 2
    i32.load16_s offset=186
    i32.const 512
    i32.and
    if  ;; label = @1
      local.get 2
      i32.load offset=116
      i32.eqz
      if  ;; label = @2
        local.get 2
        call $f33424
      end
    end
    i32.const 3
    i32.const 0
    call $f31843
    local.get 0
    i32.load offset=32
    i32.const 0
    i32.const 0
    call $f24039
    local.get 0
    i32.load offset=16
    i32.const 0
    call $f31886
    local.get 0
    i32.load offset=20
    i32.const 0
    call $f31901
    local.get 0
    i32.load offset=24
    i32.const 0
    call $f31901
    local.get 0
    i32.load offset=28
    local.set 3
    local.get 1
    i64.const 0
    i64.store align=4
    local.get 1
    i64.const 0
    i64.store offset=8 align=4
    local.get 1
    f32.const 0x0p+0 (;=0;)
    f32.store
    local.get 1
    f32.const 0x0p+0 (;=0;)
    f32.store offset=4
    local.get 1
    f32.const 0x0p+0 (;=0;)
    f32.store offset=8
    local.get 1
    f32.const 0x0p+0 (;=0;)
    f32.store offset=12
    local.get 1
    i32.const 16
    i32.add
    local.tee 2
    local.get 1
    i64.load align=4
    i64.store align=4
    local.get 2
    local.get 1
    i64.load offset=8 align=4
    i64.store offset=8 align=4
    i32.const 23
    local.get 3
    local.get 2
    call $f16624
    local.get 0
    i32.const 0
    i32.store8 offset=40
    local.get 0
    i32.load offset=36
    i32.const 0
    i32.const 0
    call $f24039
    local.get 0
    i32.load offset=12
    i32.const 0
    call $GameController_ResetItems
    local.get 1
    global.set $stack)

 (export "IntroManager_HideIntro" (func $IntroManager_HideIntro))
  (func $IntroManager_Constructorctor (param i32 i32)
    i32.const 2496723
    i32.load8_s
    i32.eqz
    if  ;; label = @1
      i32.const 1361316
      i32.load
      call $f34102
      i32.const 2496723
      i32.const 1
      i32.store8
    end
    local.get 0
    i32.const 1
    i32.store8 offset=40
    local.get 0
    i32.const 44
    i32.add
    i32.const 1976112
    i32.load
    i32.store
    local.get 0
    i32.const 68
    i32.add
    i32.const 1990028
    i32.load
    i32.store
    local.get 0
    i32.const 72
    i32.add
    i32.const 1990032
    i32.load
    i32.store
    local.get 0
    i32.const 76
    i32.add
    i32.const 1990036
    i32.load
    i32.store
    local.get 0
    i32.const 80
    i32.add
    i32.const 1990040
    i32.load
    i32.store
    local.get 0
    i32.const 84
    i32.add
    i32.const 1990044
    i32.load
    i32.store
    local.get 0
    i32.const 88
    i32.add
    i32.const 1990048
    i32.load
    i32.store
    local.get 0
    i32.const 92
    i32.add
    i32.const 1990052
    i32.load
    i32.store
    local.get 0
    i32.const 96
    i32.add
    i32.const 1990056
    i32.load
    i32.store
    local.get 0
    i32.const 100
    i32.add
    i32.const 1990060
    i32.load
    i32.store
    local.get 0
    i32.const 104
    i32.add
    i32.const 1990064
    i32.load
    i32.store
    local.get 0
    i32.const 108
    i32.add
    i32.const 1990068
    i32.load
    i32.store
    local.get 0
    i32.const 112
    i32.add
    i32.const 1990072
    i32.load
    i32.store
    local.get 0
    i32.const 116
    i32.add
    i32.const 1990076
    i32.load
    i32.store
    local.get 0
    i32.const 120
    i32.add
    i32.const 1990080
    i32.load
    i32.store
    local.get 0
    i32.const 124
    i32.add
    i32.const 1990084
    i32.load
    i32.store
    local.get 0
    i32.const 128
    i32.add
    i32.const 1990088
    i32.load
    i32.store
    local.get 0
    i32.const 0
    call $f23815)

 (export "IntroManager_Constructorctor" (func $IntroManager_Constructorctor))
)