import React, { useEffect, useRef, useState } from 'react';
import { useTable } from 'react-table';
import getInitialFlightData from './DataProvider';
import columns from './Columns';

interface FlightState {
  state: string;
  flight: string;
}

function App() {
  const [data, setData] = useState(getInitialFlightData());
  const eventSource = useRef<EventSource>();
  // @ts-expect-error
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const updateFlightState = (flightState: FlightState) => {
    setData(currentData =>
      currentData.map(item => {
        if (item.flight === flightState.flight) {
          item.state = flightState.state;
        }

        return item;
      })
    );
  };

  const removeFlight = (flightState: FlightState) => {
    setData(currentData => {
      return currentData.filter(item => item.flight !== flightState.flight);
    });
  };

  const stopUpdates = () => {
    if (eventSource.current) {
      console.log('Client stopped listening');
      eventSource.current.close();
    }
  };

  useEffect(() => {
    eventSource.current = new EventSource(
      `${window.location.origin}/sseapi/events`
    );

    eventSource.current.addEventListener('flightStateUpdate', event => {
      updateFlightState(JSON.parse(event.data));
    });

    eventSource.current.addEventListener('flightRemoval', event => {
      removeFlight(JSON.parse(event.data));
    });

    eventSource.current.addEventListener('closedConnection', event => {
      stopUpdates();
    });

    return () => {
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, []);

  return (
    <div>
      <button onClick={stopUpdates}>Stop updates</button>

      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
